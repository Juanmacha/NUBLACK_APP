const nodemailer = require('nodemailer');
const { create } = require('express-handlebars');
const path = require('path');
require('dotenv').config();

// Configuración del transporter de Nodemailer para Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'nublack04@gmail.com',
      pass: process.env.EMAIL_PASS // Necesitas usar App Password de Gmail
    }
  });
};

// Configuración de Handlebars para templates de email
const hbs = create({
  extname: '.hbs',
  defaultLayout: false,
  layoutsDir: path.join(__dirname, '../templates/email/layouts'),
  partialsDir: path.join(__dirname, '../templates/email/partials')
});

// Función para verificar la configuración del email
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Configuración de email verificada correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error en la configuración de email:', error.message);
    return false;
  }
};

// Función para enviar email de recuperación de contraseña
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/restablecer-contrasena?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'NUblack <nublack04@gmail.com>',
      to: email,
      subject: 'Recuperación de Contraseña - NUblack',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6b5b47; font-size: 28px; margin: 0;">NUblack</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Tienda de ropa y calzado deportivo</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">Recuperación de Contraseña</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hola <strong>${userName}</strong>,
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en NUblack.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Haz clic en el siguiente botón para crear una nueva contraseña:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #6b5b47; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                Restablecer Contraseña
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña permanecerá sin cambios.
            </p>
            <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 10px 0 0 0;">
              Este enlace expirará en 1 hora por seguridad.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 NUblack. Todos los derechos reservados.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
              ${process.env.STORE_ADDRESS || 'Calle 123 #45-67, Bogotá'} | 
              ${process.env.STORE_PHONE || '3001234567'} | 
              ${process.env.STORE_EMAIL || 'contacto@nublack.com'}
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de recuperación enviado correctamente:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email de recuperación:', error.message);
    return { success: false, error: error.message };
  }
};

// Función para enviar email de bienvenida
const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'NUblack <nublack04@gmail.com>',
      to: email,
      subject: '¡Bienvenido a NUblack!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6b5b47; font-size: 28px; margin: 0;">NUblack</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Tienda de ropa y calzado deportivo</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">¡Bienvenido a NUblack!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hola <strong>${userName}</strong>,
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              ¡Gracias por registrarte en NUblack! Estamos emocionados de tenerte como parte de nuestra comunidad.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Ahora puedes disfrutar de:
            </p>
            
            <ul style="color: #666; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
              <li>Acceso a nuestra colección completa de ropa y calzado deportivo</li>
              <li>Ofertas exclusivas y descuentos especiales</li>
              <li>Seguimiento de pedidos en tiempo real</li>
              <li>Envío gratis en compras superiores a $200,000</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}" 
                 style="background-color: #6b5b47; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                Explorar Productos
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 NUblack. Todos los derechos reservados.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
              ${process.env.STORE_ADDRESS || 'Calle 123 #45-67, Bogotá'} | 
              ${process.env.STORE_PHONE || '3001234567'} | 
              ${process.env.STORE_EMAIL || 'contacto@nublack.com'}
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenida enviado correctamente:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email de bienvenida:', error.message);
    return { success: false, error: error.message };
  }
};

// Función para enviar email de confirmación de pedido
const sendOrderConfirmationEmail = async (email, userName, orderData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'NUblack <nublack04@gmail.com>',
      to: email,
      subject: `Confirmación de Pedido #${orderData.numero_pedido} - NUblack`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6b5b47; font-size: 28px; margin: 0;">NUblack</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Tienda de ropa y calzado deportivo</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">¡Pedido Confirmado!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hola <strong>${userName}</strong>,
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hemos recibido tu pedido y lo estamos procesando. Aquí tienes los detalles:
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Detalles del Pedido</h3>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Número de Pedido:</strong> ${orderData.numero_pedido}</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Fecha:</strong> ${new Date(orderData.fecha_solicitud).toLocaleDateString('es-CO')}</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Total:</strong> $${orderData.total.toLocaleString('es-CO')}</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>Método de Pago:</strong> ${orderData.metodo_pago}</p>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
              Te notificaremos cuando tu pedido esté en camino. ¡Gracias por elegir NUblack!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 NUblack. Todos los derechos reservados.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
              ${process.env.STORE_ADDRESS || 'Calle 123 #45-67, Bogotá'} | 
              ${process.env.STORE_PHONE || '3001234567'} | 
              ${process.env.STORE_EMAIL || 'contacto@nublack.com'}
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación de pedido enviado correctamente:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email de confirmación de pedido:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createTransporter,
  verifyEmailConfig,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail
};
