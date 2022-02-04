const PlayButton = () => (
  <>
    <style>
      {
        '\
          .player {\
          background: none;\
          width: 50px;\
          height: 50px;\
          border: solid 5px #fff;\
          border-radius: 100%;\
          position: relative; \
          text-indent:-9999px;\
          box-shadow: 1px 1px 3px #999999;\
        }\
        \
        .player span {\
          width: 0;\
          height: 0;\
          border-top: 15px solid transparent;\
          border-left: 20px solid #fff;\
          border-bottom: 15px solid transparent;\
          position:absolute;\
          top:14%;\
          left:36%;\
        }\
        '
      }
    </style>
    <div className="player">
      <span>Play</span>
    </div>
  </>
)

export default PlayButton
