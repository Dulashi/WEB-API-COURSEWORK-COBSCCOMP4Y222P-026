const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sns = new AWS.SNS();

const sendSMS = async (phoneNumber, message) => {
  try {
    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };
    await sns.publish(params).promise();
    console.log('SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = sendSMS;
