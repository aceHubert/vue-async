module.exports = {
  '/timeout': (req, resp) => {
    const { countdown = 10 } = req.query;
    const second = isNaN(countdown) ? 10 : Number(countdown);
    setTimeout(() => {
      resp.send('success');
    }, second * 1000);
  },
  '/error': (req, resp) => {
    const { status = 400 } = req.query;
    resp.status(isNaN(status) ? 400 : Number(status)), resp.send('Error 400');
  },
};
