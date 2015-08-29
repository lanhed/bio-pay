/*
  GetLatestPayPalPayment

  Demonstrates retrieving the latest payment to a PayPal account.

  This example code is in the public domain.
*/

//this is my personal Temboo acoount so don't worry about it.
#define TEMBOO_ACCOUNT "jjtara"  // your Temboo account name
#define TEMBOO_APP_KEY_NAME "myFirstApp"  // your Temboo app key name
#define TEMBOO_APP_KEY  "88681f56ac9041e6aab886fa2b7624d3"  // your Temboo app key


#include <Bridge.h>
#include <Temboo.h>
// include the library code:
#include <LiquidCrystal.h>

/*** SUBSTITUTE YOUR VALUES BELOW: ***/

// Note that for additional security and reusability, you could
// use #define statements to specify these values in a .h file.

// your PayPal app's Client ID, available from developer.paypal.com
const String PAYPAL_CLIENT_ID = "AXhJHNQGq55tGByoYxgX7fZB4iRuPcJoiY3Dlf_nGHaXplM0Qs--DpOzRhwqOEpjIjeFVjd8kb9Cd02U";

// your PayPal app's Client Secret, available from developer.paypal.com
const String PAYPAL_CLIENT_SECRET = "EESj5ym8XdFkxjau14gy3mEyBlFEELqyP6mFpWdFzSYbfG0FqPoDgdUI_zKCv632JMxH3WG57n2JNbt9";

// a value to indicate whether you're using the PayPal API sandbox or not: 1 = yes, 0 = no.
const String USE_SANDBOX = "1";

int numRuns = 1;   // execution count, so this doesn't run forever
int maxRuns = 10;   // maximum number of times the Choreo should be executed

// initialize the library with the numbers of the interface pins
LiquidCrystal lcd(8, 9, 4, 5, 6, 7);


void setup() {
  Serial.begin(9600);

  // For debugging, wait until a serial console is connected.
  delay(4000);
  while(!Serial);
  Bridge.begin();
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
}
void loop()
{
  if (numRuns <= maxRuns) {
    Serial.println("Running ListPayments - Run #" + String(numRuns++) + "\n");

    TembooChoreo ListPaymentsChoreo;

    // invoke the Temboo client
    ListPaymentsChoreo.begin();

    // set Temboo account credentials
    ListPaymentsChoreo.setAccountName(TEMBOO_ACCOUNT);
    ListPaymentsChoreo.setAppKeyName(TEMBOO_APP_KEY_NAME);
    ListPaymentsChoreo.setAppKey(TEMBOO_APP_KEY);

    // identify choreo to run
    ListPaymentsChoreo.setChoreo("/Library/PayPal/Payments/ListPayments");

    // set choreo inputs
    ListPaymentsChoreo.addInput("ClientID", PAYPAL_CLIENT_ID);
    ListPaymentsChoreo.addInput("ClientSecret", PAYPAL_CLIENT_SECRET);
    ListPaymentsChoreo.addInput("UseSandbox", USE_SANDBOX);


    // set choreo output filters
    ListPaymentsChoreo.addOutputFilter("time", "/payments/create_time", "Response");
    ListPaymentsChoreo.addOutputFilter("amount", "/payments/transactions/amount/total", "Response");
    ListPaymentsChoreo.addOutputFilter("id", "/payments/id", "Response");

    // run choreo
    ListPaymentsChoreo.run();

    // parse the results and print them to the serial monitor
    while(ListPaymentsChoreo.available()) {
        // read the name of the next output item
        String name = ListPaymentsChoreo.readStringUntil('\x1F');
        name.trim(); // use “trim” to get rid of newlines

        // read the value of the next output item
         lcd.setCursor(0, 0);
        String data = ListPaymentsChoreo.readStringUntil('\x1E');
        data.trim(); // use “trim” to get rid of newlines

         if (name == "time") {
             Serial.println("Received: " + data);
             lcd.print(data);
         } else if (name == "amount") {
             Serial.println("Amount: $" + data);
         } else if (name == "id") {
             Serial.println("Payment ID: " + data);
        }
    }
    ListPaymentsChoreo.close();

  }

  Serial.println("\nWaiting...\n");
  delay(30000); // wait 30 seconds between ListPayments calls
}
