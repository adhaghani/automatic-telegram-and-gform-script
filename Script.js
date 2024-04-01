function onFormSubmit() {
  try {
    var sheetID = "YOUR_GOOGLE_SHEET_ID";
    var spreadsheet = SpreadsheetApp.openById(sheetID);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var editFORM_ID = "GOOGLE_FORM_EDIT_ID";
    var YOUR_BOT_TOKEN = "BOT_TOKEN";
    var YOUR_CHAT_ID = "TELEGRAM_CHANNEL_ID";

    /** Work with Google FORM and Telegram API */
    var form = FormApp.openById(editFORM_ID);
    var formResponses = form.getResponses();
    var latestResponse = formResponses[formResponses.length - 1]; //only the latest one

    var response = latestResponse.getItemResponses();
    var latestEmail = latestResponse.getRespondentEmail();

    var targetEmails = ["Any email that need to be suspended"];

    if (targetEmails.includes(latestEmail)) {
      Logger.log("Targeted Email found. Ending.");
      return;
    } else {
      Logger.log("No Target Email Found. Continuing...");
    }

    var messages = [];

    var messageID = getLastRowNumber(sheet) + 1;

    for (var i = 0; i < response.length; i++) {
      var question = response[i].getItem().getTitle();
      var answer = response[i].getResponse();

      var message = answer;
      message = removeHashtagAndNumbers(message);

      meesage = Utilities.base64EncodeWebSafe(message);

      Logger.log("message Does not Exceed limit. Continuing...");
      message = "<b>#" + messageID + "</b> " + message;

      messages.push(message);
    }

    var telegramMessages = messages.join("\n");

    var telegramUrl =
      "https://api.telegram.org/bot" + YOUR_BOT_TOKEN + "/sendMessage";

    var payload = {
      chat_id: YOUR_CHAT_ID,
      text: telegramMessages,
      parse_mode: "HTML" // Sending as plain text
    };

    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    };

    UrlFetchApp.fetch(telegramUrl, options);
  } catch (error) {
    Logger.log("Error occurred: " + error.toString());
  }
}

function getLastRowNumber(sheet) {
  var lastRow = sheet.getLastRow();

  while (lastRow > 0 && sheet.getRange(lastRow, 1).isBlank()) {
    lastRow--;
  }

  return lastRow;
}
function removeHashtagAndNumbers(str) {
  // Use a regular expression to remove '#' followed by numbers, with optional whitespace characters
  return str.replace(/#\s*\d+\s*/g, "");
}
