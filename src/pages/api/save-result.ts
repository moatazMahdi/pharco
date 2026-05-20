import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile:
    "./src/credentials.json",

  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, mobile, score, answers } = req.body;

    // const client = await auth.getClient();

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    // GET EXISTING NUMBERS
    const existingRows =
      await sheets.spreadsheets.values.get({
        spreadsheetId:
          "1mGnXWI3BDw4qPD-6qaUoU79LwBcYwsYEKflZx5DBLJ8",

        range: "Sheet1!A:A",
      });

    const existingNumbers =
      existingRows.data.values?.flat() || [];

    // GENERATE UNIQUE NUMBER
    let clientNumber;

    do {
      clientNumber = Math.floor(
        Math.random() * 10000
      ) + 1;
    } while (
      existingNumbers.includes(
        clientNumber.toString()
      )
    );

    // SAVE TO SHEET
    await sheets.spreadsheets.values.append({
      spreadsheetId:
        "1mGnXWI3BDw4qPD-6qaUoU79LwBcYwsYEKflZx5DBLJ8",

      range: "Sheet1!A1",

      valueInputOption: "USER_ENTERED",

      requestBody: {
        values: [
          [
            clientNumber,
            name,
            mobile,
             `${score}/10`,
            ...answers.map(
              (item: any) => item.answer
            ),
          ],
        ],
      },
    });

    res.status(200).json({
      success: true,
      clientNumber,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}