export default ({ env }) => ({
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        event: {
          // Убедитесь, что это имя вашей коллекции
          field: "slug",
          references: "title",
        },
      },
    },
  },
  email: {
    provider: "nodemailer",
    providerOptions: {
      host: env("SMTP_HOST", "smtp.example.com"),
      port: env.int("SMTP_PORT", 587),
      auth: {
        user: env("SMTP_USERNAME"),
        pass: env("SMTP_PASSWORD"),
      },
      // Дополнительные настройки, если нужны
      secure: env.bool("SMTP_SECURE", false),
    },
    settings: {
      defaultFrom: "noreply@example.com",
      defaultReplyTo: "noreply@example.com",
    },
  },
});
