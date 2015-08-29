#define TEMBOO_ACCOUNT "jjtara"  // Your Temboo account name 
#define TEMBOO_APP_KEY_NAME "myFirstApp"  // Your Temboo app key name
#define TEMBOO_APP_KEY "88681f56ac9041e6aab886fa2b7624d3"  // Your Temboo app key

#include <Bridge.h>
#include <Temboo.h>


#include <LiquidCrystal.h>

LiquidCrystal lcd(8, 9, 4, 5, 6, 7);           // select the pins used on the LCD panel


int numRuns = 1;   // Execution count, so this doesn't run forever
int maxRuns = 10;   // Maximum number of times the Choreo should be executed

void setup() {
  Serial.begin(9600);

  // For debugging, wait until the serial console is connected
  delay(2000);
  while (!Serial);
  Bridge.begin();

  lcd.begin(16, 2);               // start the library
  lcd.setCursor(0, 0);            // set the LCD cursor   position
  lcd.print("ready");  // print a simple message on the LCD


}

void loop() {

  if (numRuns <= maxRuns) {
    lcd.setCursor(9, 1);            // move cursor to second line "1" and 9 spaces over
    lcd.print(millis() / 1000);     // display seconds elapsed since power-up

    lcd.setCursor(0, 1);            // move to the begini
    Serial.println("Running AcceptPayPalPayment - Run #" + String(numRuns++));

    TembooChoreo AcceptPayPalPaymentChoreo;

    // Invoke the Temboo client
    AcceptPayPalPaymentChoreo.begin();

    // Set Temboo account credentials
    AcceptPayPalPaymentChoreo.setAccountName(TEMBOO_ACCOUNT);
    AcceptPayPalPaymentChoreo.setAppKeyName(TEMBOO_APP_KEY_NAME);
    AcceptPayPalPaymentChoreo.setAppKey(TEMBOO_APP_KEY);

    // Set profile to use for execution
    AcceptPayPalPaymentChoreo.setProfile("PayPalAPIAccount");

    // Set Choreo inputs
    AcceptPayPalPaymentChoreo.addInput("CancelURL", "http://127.0.0.1");
    AcceptPayPalPaymentChoreo.addInput("UseSandbox", "1");
    AcceptPayPalPaymentChoreo.addInput("Currency", "EUR");
    AcceptPayPalPaymentChoreo.addInput("ReturnURL", "http://127.0.0.1");
    AcceptPayPalPaymentChoreo.addInput("Total", "1");


    //AcceptPayPalPaymentChoreo.addOutputFilter("id", "/payments/id", "Response");

    // Identify the Choreo to run
    AcceptPayPalPaymentChoreo.setChoreo("/Library/PayPal/Payments/AcceptPayPalPayment");

    // Run the Choreo; when results are available, print them to serial
    AcceptPayPalPaymentChoreo.run();

    while (AcceptPayPalPaymentChoreo.available()) {

      // read the name of the next output item
      String values = AcceptPayPalPaymentChoreo.readStringUntil('\x1F');
      values.trim(); // use “trim” to get rid of newlines
      //Serial.print(values);
      // read the value of the next output item
      String data = AcceptPayPalPaymentChoreo.readStringUntil('\x1E');
      data.trim(); // use “trim” to get rid of newlines
      //lcd.println(values);
      if (values == "PaymentID") {
        
        Serial.println("PaymentID:"+ data);
        lcd.setCursor(0, 0);
        lcd.print("PaymentID:");     
        lcd.setCursor(0, 1);
        lcd.print(data);
      }
    }

    AcceptPayPalPaymentChoreo.close();
  }

  Serial.println("Waiting...");
  delay(30000); // wait 30 seconds between AcceptPayPalPayment calls
}

