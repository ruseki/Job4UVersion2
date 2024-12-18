const bcrypt = require('bcryptjs');

const plainPassword = 'Password@123';
const hashedPassword = '$2a$08$HM0ujNBGm7lIHK76dMRCOeD2QzdVirbrmK0ZFtNWodtTZGTNoZTh2'; 

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) throw err;
  console.log('Password matches:', isMatch);
});
