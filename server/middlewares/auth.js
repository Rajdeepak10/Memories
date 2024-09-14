import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Safely access the token
    const tokenSegment = token?.split(".");
    
    const lengthOfTokenSegment = tokenSegment?.length;

    let decodedData;

    if (token) {
      if (lengthOfTokenSegment === 3) {
        // Custom JWT token
        decodedData = jwt.verify(token, 'test');
        req.userId = decodedData?.id;
      } else {
        // Google access token
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);

        if (response.ok) {
          const userData = await response.json();
          console.log(userData)
          req.userId = userData.sub; // Assuming 'sub' is the user identifier from Google
        } else {
          console.error('Failed to fetch user data from Google. Status:', response.status);
          return res.status(401).json({ message: 'Authentication failed' });
        }
      }
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export default auth;
