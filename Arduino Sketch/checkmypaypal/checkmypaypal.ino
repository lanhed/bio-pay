#include <Bridge.h>
#include <Temboo.h>
#include <LiquidCrystal.h>

LiquidCrystal lcd(8, 9, 4, 5, 6, 7);           // select the pins used on the LCD panel

// define some values used by the panel and buttons
int lcd_key     = 0;
int adc_key_in  = 0;

#define btnRIGHT  0
#define btnUP     1
#define btnDOWN   2
#define btnLEFT   3
#define btnSELECT 4
#define btnNONE   5

#define TEMBOO_ACCOUNT "jjtara"  // Your Temboo account name 
#define TEMBOO_APP_KEY_NAME "myFirstApp"  // Your Temboo app key name
#define TEMBOO_APP_KEY "88681f56ac9041e6aab886fa2b7624d3"  // Your Temboo app key


// The number of times to trigger the action if the condition is met
// We limit this so you won't use all of your Temboo calls while testing
int maxCalls = 10;

// The number of times this Choreo has been run so far in this sketch
int calls = 0;

int inputPin = A0;


void setup() {
  Serial.begin(9600);

  // For debugging, wait until the serial console is connected
  delay(1000);
  while (!Serial);
  Bridge.begin();

  lcd.begin(16, 2);               // start the library
  lcd.setCursor(0, 0);            // set the LCD cursor   position
  lcd.print("Push the buttons");  // print a simple message on the LCD

  // Initialize pins
  pinMode(inputPin, INPUT);

  Serial.println("Setup complete.\n");
}

void loop() {

  lcd.setCursor(9, 1);            // move cursor to second line "1" and 9 spaces over
  lcd.print(millis() / 1000);     // display seconds elapsed since power-up

  lcd.setCursor(0, 1);            // move to the begining of the second line
  lcd_key = read_LCD_buttons();   // read the buttons

  int sensorValue = digitalRead(lcd_key);
  Serial.println("Sensor: " + String(sensorValue));

  if (sensorValue == HIGH) {
    if (calls < maxCalls) {
      Serial.println("\nTriggered! Calling GetLatestPayment Choreo...");
      runGetLatestPayment(sensorValue);
      calls++;
    } else {
      Serial.println("\nTriggered! Skipping to save Temboo calls. Adjust maxCalls as required.");
    }
  }
  delay(250);
}

void runGetLatestPayment(int sensorValue) {
  TembooChoreo GetLatestPaymentChoreo;

  // Invoke the Temboo client
  GetLatestPaymentChoreo.begin();

  // Set Temboo account credentials
  GetLatestPaymentChoreo.setAccountName(TEMBOO_ACCOUNT);
  GetLatestPaymentChoreo.setAppKeyName(TEMBOO_APP_KEY_NAME);
  GetLatestPaymentChoreo.setAppKey(TEMBOO_APP_KEY);

  // Set profile to use for execution
  GetLatestPaymentChoreo.setProfile("paypal");
  // Identify the Choreo to run
  GetLatestPaymentChoreo.setChoreo("/Library/PayPal/Payments/GetLatestPayment");

  // Run the Choreo
  unsigned int returnCode = GetLatestPaymentChoreo.run();

  // Read and print the error message
  while (GetLatestPaymentChoreo.available()) {
    char c = GetLatestPaymentChoreo.read();
    Serial.print(c);
  }
  Serial.println();
  GetLatestPaymentChoreo.close();
}



int read_LCD_buttons() {              // read the buttons
  adc_key_in = analogRead(0);       // read the value from the sensor

  // my buttons when read are centered at these valies: 0, 144, 329, 504, 741
  // we add approx 50 to those values and check to see if we are close
  // We make this the 1st option for speed reasons since it will be the most likely result

  if (adc_key_in > 1000) return btnNONE;

  // For V1.1 us this threshold
  if (adc_key_in < 50)   return btnRIGHT;
  if (adc_key_in < 250)  return btnUP;
  if (adc_key_in < 450)  return btnDOWN;
  if (adc_key_in < 650)  return btnLEFT;
  if (adc_key_in < 850)  return btnSELECT;

  // For V1.0 comment the other threshold and use the one below:
  /*
    if (adc_key_in < 50)   return btnRIGHT;
    if (adc_key_in < 195)  return btnUP;
    if (adc_key_in < 380)  return btnDOWN;
    if (adc_key_in < 555)  return btnLEFT;
    if (adc_key_in < 790)  return btnSELECT;
  */

  return btnNONE;                // when all others fail, return this.
}


