import styles from './VideoPlayer.module.css'
import classNames from 'classnames'

const VideoPlayer = () => {
  const h2Styles = 'text-left text-4xl indent-14 my-8'

  // let listVideo = document.querySelector('.video-list .vid')
  // let mainVideo = document.querySelector('.mainVideo')
  // let title = document.querySelectorAll('.mainVideo .title')

  // listVideo.forEach((video) => {
  //   video.onclick = () => {
  //     listVideo.forEach((vid) => vid.classList.remove('active'))
  //     video.classList.ass('active')
  //     if (video.classList.contains('active')) {
  //       let src = video.children[0].getAttribute('src')
  //     }
  //   }
  // })

  return (
    <div className={classNames(styles.container)}>
      {/* main video section */}
      <div className={classNames(styles.mainVideo)}>
        <div className={classNames(styles.video)}>
          <iframe
            width="600"
            height="400"
            src="https://www.youtube.com/embed/eac91tZsZMw"
            title="Shit Italian Moms Say #1"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
          ></iframe>
          <h3 className={classNames(styles.title)}>
            01. Shit Italian Moms Say #1{' '}
          </h3>
        </div>
      </div>

      {/* video list section */}
      <div className={classNames(styles.videoList)}>
        <div className={classNames(styles.vid)}>
          <iframe
            width="200"
            height="100"
            src="https://www.youtube.com/embed/eac91tZsZMw"
            title="Shit Italian Moms Say #1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          ></iframe>
          <h3 className={classNames(styles.title)}>
            01. Shit Italian Moms Say #2{' '}
          </h3>
        </div>

        <div className={classNames(styles.vid)}>
          <iframe
            width="200"
            height="100"
            src="https://www.youtube.com/embed/LCPV0sl4GdE"
            title="Shit Italian Moms Say #2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          <h3 className={classNames(styles.title)}>
            02. Shit Italian Moms Say #2{' '}
          </h3>
        </div>

        <div className={classNames(styles.vid)}>
          <iframe
            width="200"
            height="100"
            src="https://www.youtube.com/embed/tSF7heNcXSk"
            title="Shit Italian Moms Say #3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          <h3 className={classNames(styles.title)}>
            03. Shit Italian Moms Say #3{' '}
          </h3>
        </div>

        <div className={classNames(styles.vid)}>
          <iframe
            width="200"
            height="100"
            src="https://www.youtube.com/embed/DX2o3U8045U"
            title="Stand Up Comedy Act"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          <h3 className={classNames(styles.title)}>04. Stand Up Comedy Act</h3>
        </div>

        <div className={classNames(styles.vid)}>
          <iframe
            width="200"
            height="100"
            src="https://www.youtube.com/embed/_PCPwmuiYL0"
            title="Italian MOMster: Danny Scares Mom!"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          <h3 className={classNames(styles.title)}>
            05. Italian MOMster: Danny Scares Mom!{' '}
          </h3>
        </div>

        <div className={classNames(styles.vid)}>
          <iframe
            width="200"
            height="100"
            src="https://www.youtube.com/embed/m7FnCsSJ5WY"
            title="Italian Mom: Embarrassing Family Stories"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          <h3 className={classNames(styles.title)}>
            06. Italian Mom: Embarrassing Family Stories{' '}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
