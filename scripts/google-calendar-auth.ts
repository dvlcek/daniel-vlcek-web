import { config } from "dotenv";
import { google } from "googleapis";
import { createServer } from "node:http";
import { URL } from "node:url";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

config({
  path: ".env.local",
  quiet: true,
});

const clientId =
  process.env.GOOGLE_CALENDAR_CLIENT_ID;

const clientSecret =
  process.env.GOOGLE_CALENDAR_CLIENT_SECRET;

const redirectUri =
  process.env.GOOGLE_CALENDAR_REDIRECT_URI ??
  "http://localhost:5555/oauth2callback";

if (!clientId) {
  throw new Error(
    "GOOGLE_CALENDAR_CLIENT_ID is missing.",
  );
}

if (!clientSecret) {
  throw new Error(
    "GOOGLE_CALENDAR_CLIENT_SECRET is missing.",
  );
}

const oauth2Client =
  new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

const scopes = [
  "https://www.googleapis.com/auth/calendar.events.freebusy",
  "https://www.googleapis.com/auth/calendar.events.owned",
];

const oauthState = randomBytes(32).toString("hex");

const authorizationUrl =
  oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    include_granted_scopes: true,
    state: oauthState,
  });

const redirect =
  new URL(redirectUri);

const port =
  Number(
    redirect.port || 5555,
  );

const server =
  createServer(
    async (
      request,
      response,
    ) => {
      try {
        if (!request.url) {
          response.writeHead(400);
          response.end(
            "Missing request URL.",
          );
          return;
        }

        const requestUrl =
          new URL(
            request.url,
            redirectUri,
          );

        if (request.method !== "GET") {
          response.writeHead(405);
          response.end("Method not allowed.");
          return;
        }

        if (requestUrl.pathname === "/connect") {
          response.writeHead(302, { Location: authorizationUrl, "Cache-Control": "no-store" });
          response.end();
          return;
        }

        if (
          requestUrl.pathname !==
          redirect.pathname
        ) {
          response.writeHead(404);
          response.end("Not found.");
          return;
        }

        const receivedState = requestUrl.searchParams.get("state") ?? "";
        const receivedStateBytes = Buffer.from(receivedState);
        const expectedStateBytes = Buffer.from(oauthState);
        if (receivedStateBytes.length !== expectedStateBytes.length || !timingSafeEqual(receivedStateBytes, expectedStateBytes)) {
          response.writeHead(400);
          response.end("Invalid authorization state. Open /connect to try again.");
          return;
        }

        const oauthError =
          requestUrl.searchParams.get(
            "error",
          );

        if (oauthError) {
          console.error(
            "\nGoogle authorization failed:",
            oauthError,
          );

          response.writeHead(400);
          response.end(
            `Google authorization failed: ${oauthError}`,
          );

          server.close();
          return;
        }

        const code =
          requestUrl.searchParams.get(
            "code",
          );

        if (!code) {
          response.writeHead(400);
          response.end(
            "Authorization code missing.",
          );
          return;
        }

        const {
          tokens,
        } =
          await oauth2Client.getToken(
            code,
          );

        if (
          !tokens.refresh_token
        ) {
          throw new Error(
            "Google did not return a refresh token.",
          );
        }

        console.log(
          "\n======================================",
        );
        console.log(
          "GOOGLE CALENDAR CONNECTED",
        );
        console.log(
          "======================================\n",
        );

        const envPath = ".env.local";
        const envContent = await readFile(envPath, "utf8");
        const tokenLine = `GOOGLE_CALENDAR_REFRESH_TOKEN="${tokens.refresh_token}"`;
        const tokenPattern = /^[ \t]*(?:export[ \t]+)?GOOGLE_CALENDAR_REFRESH_TOKEN[ \t]*=.*$/gm;
        const updatedContent = tokenPattern.test(envContent)
          ? envContent.replace(tokenPattern, () => tokenLine)
          : `${envContent.trimEnd()}\n${tokenLine}\n`;
        await writeFile(envPath, updatedContent, "utf8");
        console.log("Refresh token saved to .env.local. No token was printed. Restart the app if it does not reload the environment automatically.");

        response.writeHead(
          200,
          {
            "Content-Type":
              "text/html; charset=utf-8",
          },
        );

        response.end(`
          <!doctype html>
          <html>
            <body
              style="
                background:#020608;
                color:#fff;
                font-family:Arial,sans-serif;
                display:grid;
                place-items:center;
                min-height:100vh;
                margin:0;
              "
            >
              <div style="text-align:center">
                <h1>Google Calendar connected.</h1>
                <p style="color:rgba(255,255,255,.5)">
                  You can close this window.
                </p>
              </div>
            </body>
          </html>
        `);

        server.close();
      } catch (error) {
        console.error(
          "\nGoogle OAuth callback failed:\n",
          error instanceof Error ? error.message : "Unknown error",
        );

        response.writeHead(500);
        response.end(
          "Google Calendar connection failed.",
        );

        server.close();
      }
    },
  );

server.listen(
  port,
  "127.0.0.1",
  () => {
    console.log(
      "\n======================================",
    );
    console.log(
      "DANIEL VLKO — GOOGLE CALENDAR AUTH",
    );
    console.log(
      "======================================\n",
    );

    console.log(
      "Open this URL in your browser:\n",
    );

    console.log(
      `http://localhost:${port}/connect`,
    );

    console.log(
      "\nWaiting for Google callback...\n",
    );
  },
);
