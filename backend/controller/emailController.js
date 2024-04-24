import createTransport from "../utils/nodemailer.js";
import configureImap from "../utils/imap.js";
import Lead from "../models/leadModel.js";
import SentEmail from "../models/sentEmailModel.js";
import asyncHandler from "express-async-handler"; // Middleware for handling asynchronous operations in Express
import { simpleParser } from "mailparser"; // Library to parse email messages
import axios from "axios"; // HTTP client for making requests
import Imap from "imap"; // Imap client library for nodejs

// @desc    Send Email from the Logged User
// route    POST /send-email
// @access  Private

const sendEmail = asyncHandler(async (req, res) => {
  // Retrieve user information from req.user(stored using the authentication from passport.js)
  const user = req.user;
  // Retrieve recipient, subject, and text from request body(coming from the application )
  const { recipient, subject, text } = req.body;

  // Email Options
  const mailOptions = {
    from: user.email, // Set sender as the authenticated user's eamil
    to: recipient, // Content of the recipient
    subject: subject, // Content of the Subject
    text: text, // Content of the text
  };

  // Creating a transporter for sending emails
  const transporter = createTransport(user);

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending mail", error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      console.log("Email sent:", info.response);
      const linkTo = `https://mail.google.com/mail/u/0/#search/rfc822msgid:${info.messageId}`;

      // create a new Lead object with extracted information
      const newSentEmail = new SentEmail({
        subject: subject,
        recipient: recipient,
        user: user,
        link: linkTo,
      });

      // Save new Lead object to the database
      newSentEmail.save();
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

// @desc    Retrieve Responses from the Email Sent
// route    POST /read-emails
// @access  Private
const receiveEmail = asyncHandler(async (req, res) => {
  // Retrieve user information from req.user(stored using the authentication from passport.js)
  const user = req.user;

  function extractNameFromEmail(email) {
    // Split the email address by '@' symbol
    const parts = email.split("@");
    if (parts.length === 2) {
      // Get the part before '@' symbol
      const namePart = parts[0];
      // Split the name part by '.' or '_'
      const nameParts = namePart.split(/[._]/);
      // Capitalize each part and join them with space
      const name = nameParts
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      return name;
    } else {
      // If email is not in the expected format, return the original email
      return email;
    }
  }

  let photoUrl = "https://lh3.googleusercontent.com/a/default-user=s100";

  try {
    // Retrieve subjects from the database
    const subjects = await SentEmail.find({ user: user._id });

    // Configure IMAP Settings using user information
    const imapConfig = configureImap(user);
    const imap = new Imap(imapConfig);

    // Open the gmail inbox
    function openInbox(cb) {
      imap.openBox("INBOX", false, cb);
    }

    // When the imap connection is ready, call the openInbox function
    imap.once("ready", function () {
      openInbox(function (err, box) {
        if (err) {
          console.error("Error opening inbox:", err);
          imap.end();
          return res.status(500).json({ message: "Internal Server Error" });
        }

        // Iterate over each subject
        subjects.forEach(async (subjectDoc) => {
          // Search for unread emails with specific subject and as replies to emails sent by the user
          imap.search(
            ["UNSEEN", ["HEADER", "SUBJECT", subjectDoc.subject]],
            async (err, results) => {
              if (err) {
                console.error("Error searching for emails:", err);
                imap.end();
                return res
                  .status(500)
                  .json({ message: "Internal Server Error" });
              }

              if (results.length === 0) {
                console.log(
                  `No unseen messages matching the criteria for subject: ${subjectDoc.subject}`
                );

                const lead = await Lead.findOne({
                  user: user._id,
                  email: subjectDoc.recipient,
                  source: "Email Inquiry",
                });

                if (!lead) {
                  // Lead with the same email address doesn't exist, create a new lead
                  const newLead = new Lead({
                    account: extractNameFromEmail(subjectDoc.recipient),
                    email: subjectDoc.recipient,
                    image: photoUrl,
                    status: "Cold",
                    user: user,
                    source: "Email Inquiry",
                    link: subjectDoc.link,
                  });
                  newLead.save();
                } else {
                  // Update the existing lead document
                  await Lead.findOneAndUpdate(
                    { user: user._id, email: subjectDoc.recipient, source:"Email Inquiry" },
                    {
                      $set: {
                        status: "Cold",
                        link: subjectDoc.link,
                        deleted: false
                      },
                    },
                    { new: true }
                  );
                }

                return; // Move to the next subject
              }

              // Marking the emails as seen
              imap.setFlags(results, ["\\Seen"], async function (err) {
                if (err) {
                  console.error("Error marking emails as seen:", err);
                } else {
                  console.log("Marked as seen");
                }
              });

              // Fetch the email bodies for processing
              const fetch = imap.fetch(results, { bodies: "" });

              fetch.on("message", async (msg, seqno) => {
                console.log("Message #%d", seqno);
                var prefix = "(#" + seqno + ") ";

                // Handle the email body
                msg.on("body", (stream) => {
                  // Parse the email body using simple Parser
                  simpleParser(stream, async (err, parsed) => {
                    if (err) {
                      console.error("Error parsing the email:", err);
                      return;
                    }

                    // Extract the information from the parsed email
                    const { from, text } = parsed;
                    console.log(parsed);

                    // Remove quoted text from the email reply
                    const emailReply = text
                      .replace(/On [^\n]+ wrote:[\s\S]+$/g, "")
                      .trim();

                    // Split the email content into an array of words
                    const textArray = emailReply.trim().split(" ");
                    console.log(from);
                    console.log(textArray);

                    // Processing to determine the status
                    let status;

                    // Determine status of email based on keywords
                    if (
                      textArray.includes("No") ||
                      textArray.includes("I am sorry")
                    ) {
                      status = "Dead";
                    } else {
                      status = "Warm";
                    }

                    // Retrieve access token of the authenticated user
                    const accessToken = user.accessToken;
                    // Extract the email address of the reply
                    const query = from.value[0].address;

                    // Making a request to Google People API to search for the sender's information
                    const response = await axios.get(
                      "https://people.googleapis.com/v1/otherContacts:search",
                      {
                        params: {
                          query: query,
                          readMask: "emailAddresses,photos", // Request specific fields
                        },
                        headers: {
                          Authorization: `Bearer ${accessToken}`, // Include access token in the request header
                          Accept: "application/json", // Specify accepted response format
                        },
                      }
                    );

                    // Handle the response from the Google People API
                    console.log("Google People API Response:", response.data);
                    const results = response.data.results;

                    // If results are found
                    if (results && results.length > 0) {
                      const person = results[0].person;
                      console.log("Person Information:", person);

                      // Check if the person has a photo
                      if (person.photos && person.photos.length > 0) {
                        photoUrl = person.photos[0].url;
                        console.log("Photo URL:", person.photos[0].url);
                      } else {
                        console.log("No photo available for this contact.");
                      }
                    } else {
                      console.log("No results found.");
                    }

                    // Create a new Lead object with extracted information
                    const leadFields = {
                      account: from.value[0].name,
                      image: photoUrl,
                      status: status,
                      deleted: false
                    };

                    leadFields.$unset = { expirationDate: "" };

                    // Save new Lead object to the database
                    await Lead.findOneAndUpdate(
                      { email: from.value[0].address, user: user._id, source:"Email Inquiry" },
                      leadFields,
                      { upsert: true, new: true }
                    );
                  });
                });

                // Log message completion
                msg.once("end", () => {
                  console.log(prefix + "Finished");
                });
              });

              // Log fetch error
              fetch.once("error", (error) => {
                console.error("Fetch Error:", error);
              });

              // Log fetch completion
              fetch.once("end", () => {
                console.log(
                  "Done fetching all messages for subject:",
                  subjectDoc.subject
                );
              });
            }
          );
        });
      });
    });

    // Log errors and end connection
    imap.once("error", function (err) {
      console.error("IMAP Error:", err);
      imap.end();
    });

    // Log connection end
    imap.once("end", function () {
      console.log("Connection ended");
    });

    // Connect to the IMAP server
    imap.connect();

    // Respond with success message
    res.status(200).json({ message: "Successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { sendEmail, receiveEmail };
