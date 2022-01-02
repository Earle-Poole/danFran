import Image from 'next/image'

const MailChimpInput = () => {
  return (
    <>
      <div
        id="mc_embed_signup"
        style={{
          background: '#fff',
          clear: 'left',
          font: '14px Helvetica,Arial,sans-serif',
        }}
        className=""
      >
        <form
          action="https://udsterleads.us10.list-manage.com/subscribe/post?u=c97ea1160f134dbeb8cbe8bd6&amp;id=66c6445cca"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
        >
          <div id="mc_embed_signup_scroll" className="flex">
            <input
              type="email"
              name="EMAIL"
              id="mce-EMAIL"
              placeholder="email address"
              className="w-80 text-black text-xl p-2"
              required
            />
            <div
              style={{ position: 'absolute', left: '-5000px' }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_c97ea1160f134dbeb8cbe8bd6_66c6445cca"
                tabIndex={-1}
              />
            </div>
            <div className="optionalParent">
              <div className="clear foot">
                <input
                  type="submit"
                  value="Subscribe"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  className="flex text-2xl hover:bg-pink-500 bg-cyan-400 transition duration-150 w-fit font-light p-3 self-center hover:underline text-shadow-xs"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default MailChimpInput
