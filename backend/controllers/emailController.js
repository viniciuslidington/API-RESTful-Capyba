import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const enviarConfirmacaoEmail = async (req, res) => {
    const userId = req.userId;

    try{
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user){
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        if(user.emailVerified){
            return res.status(400).json({ message: "Email já verificado" });
        }
        const tokenemail = jwt.sign({ id: user.id }, process.env.JWT_EMAIL_TOKEN, {
            expiresIn: process.env.JWT_EMAIL_EXPIRATION
        });

        const linkDeVerificacao = `http://localhost:3000/api/email/confirmar-email?token=${tokenemail}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: '"Confirmação de E-mail" <vlidington@gmail.com>',
            to: user.email,
            subject: 'Confirme seu e-mail',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px 0;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="cid:capybaLogo" alt="Capyba" style="width: 150px;" />
                    </div>

                    <h2 style="color: #333;">Olá, ${user.name}!</h2>

                    <p style="font-size: 16px; color: #555;">
                        Estamos felizes por você estar conosco! Para concluir seu cadastro, por favor confirme seu e-mail clicando no botão abaixo:
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${linkDeVerificacao}" style="background-color: #00C897; color: white; padding: 14px 24px; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold;">
                        Confirmar E-mail
                        </a>
                    </div>

                    <p style="font-size: 14px; color: #999;">
                        O link expira em 5 minutos. Se você não solicitou este e-mail, pode ignorá-lo com segurança.
                    </p>
                    
                    <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">

                    <p style="font-size: 12px; color: #bbb; text-align: center;">
                        &copy; ${new Date().getFullYear()} Capyba. Todos os direitos reservados.
                    </p>
                    </div>
                </div>
            `,
            attachments: [
                {
                  filename: 'capyba.png',
                  path: path.join(__dirname, '../assets/capyba.png'),
                  cid: 'capybaLogo' // usado no src="cid:capybaLogo"
                }
              ]
          });

        return res.status(200).json({ message: "Email de confirmação enviado" });
    }catch(error){
        console.error("Erro ao enviar confirmação de e-mail:" , error);
        return res.status(500).json({ message: "Erro ao enviar email de confirmação" });
    }
};
  
export const confirmarEmail = async (req, res) => {
    const tokenemail = req.query.token;

    if(!tokenemail){
        return res.status(400).json({ message: "Token não encontrado" });
    }

    try{
        const decoded = jwt.verify(tokenemail, process.env.JWT_EMAIL_TOKEN);

        await prisma.user.update({
            where: {
                id: decoded.id
            },
            data: {
                emailVerified: true
            }
        });
        return res.status(200).json({ message: "Email confirmado com sucesso" });
    }catch(error){
        console.error("Erro ao confirmar e-mail:", error);
        return res.status(500).json({ message: "Erro ao confirmar e-mail" });
    }
};