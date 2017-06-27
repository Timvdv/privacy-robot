var text = {
  x: 10,
  y: 100,
  text: ['YOU', 'are', 'being', 'WATCHED'],
  ticker: 0,
  tickerActive: false,
  startTicker: function(ctx, face) {
    // console.log(this.ticker);
    if(this.tickerActive) return;

    this.ticker = 0;

    this.tickerActive = true;
    var that = this;

    setTimeout(function() {
      that.ticker++;
    }, 500);

    setTimeout(function() {
      that.ticker++;
    }, 750);

    setTimeout(function() {
      that.ticker++;
    }, 1000);

    setTimeout(function() {
      that.ticker++;
    }, 1250);
  },
  draw: function(ctx, face) {

    ctx.font="55px Proxima nova";
    ctx.fillStyle = '#D35400';

    // console.log(face.x);

    ctx.fillText(this.text[0], face.x + this.x, face.y + this.y);

    if( this.ticker > 0) {
      ctx.fillText(this.text[0], face.x + this.x, face.y + this.y);
    }

    if( this.ticker > 1) {
      ctx.font="Light 60px Proxima nova";
      ctx.fillStyle = '#AC4545';
      ctx.fillText(this.text[1], face.x + this.x, face.y + this.y + 50);
    }

    if( this.ticker > 2) {
      ctx.fillStyle = '#F39C12';
      ctx.fillText(this.text[2], face.x + this.x, face.y + this.y + 110);
      ctx.font="bold 60px Proxima nova";
    }

    if( this.ticker > 3) {
      ctx.fillStyle = '#F1C40F';
      ctx.fillText(this.text[3], face.x + this.x, face.y + this.y + 180);
    }
  }
}