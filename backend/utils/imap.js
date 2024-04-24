// Imap Configuration

// Function for creating XOAUTH2 token
const createXoauth2 = (user, token) =>
  Buffer.from(
    [`user=${user}`, `auth=Bearer ${token}`, "", ""].join("\x01"),
    "utf-8"
  ).toString("base64");

// Imap Settings
const configureImap = (user) => {
  // Generate XOAUTH2 ttoken for the user
  const xoauth2Token = createXoauth2(user.email, user.accessToken)

  const imapConfig = {
    user: user.email, //IMAP username
    xoauth2: xoauth2Token,  // XOAUTH2 token for authentication
    host: "imap.gmail.com", // IMAP server hostname (Gmail)
    port: 993,  // Port for IMAP over SSL/TLS
    tls: true,  // Enable TLS/SSL encryption
    tlsOptions: {
      rejectUnauthorized: false, // Ignore invalid SSL certificates (only used in testing)
    },
  };

  return imapConfig
}

export default configureImap;
