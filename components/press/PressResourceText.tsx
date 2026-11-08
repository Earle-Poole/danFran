import { Container } from '@/components/ui'
import styles from '@/components/templates/press-kit/PressKitTemplate.module.css'

/**
 * Historical source copy exposed as ordinary HTML so it remains readable
 * without the original PDF viewer or client-side behavior.
 */
export default function PressResourceText() {
  return (
    <section className={styles.textVersions} aria-labelledby="press-text-versions-heading">
      <Container>
        <h2 id="press-text-versions-heading" className={styles.sectionHeading}>Read the source text.</h2>
        <p className={styles.textVersionsIntro}>
          These HTML versions preserve the wording and reading order of the historical PDFs. The original files remain available above for visual reference and download.
        </p>

        <article id="biography-text-version" className={styles.textVersion} aria-labelledby="biography-text-heading" tabIndex={-1}>
          <h3 id="biography-text-heading">Daniel Franzese biography - historical source text</h3>
          <div className={styles.sourceBannerText} aria-label="Historical source banner text">
            <strong>Daniel Franzese</strong>
            <span>Mean Girls / Bully / I Spit On Your Grave</span>
            <span>@WhatsUpDanny</span>
          </div>
          <p className={styles.sourceLabel}>VIDEO | WEBSITE</p>
          <h4>Italian-American Hero</h4>
          <p>
            Best known for his role as Damian in Mean Girls, Daniel Franzese was also the lead of other indie cult classics Bully &amp; I Spit On Your Grave. He was most recently a series regular on Mark Gordon&apos;s ABC series, Conviction.
          </p>
          <p>
            Prior to that he was a series regular on the Freeform series Recovery Road. Originally from Brooklyn, Daniel has become a well-known proponent and speaker for the LGBT Community. He reached 8 million views on his YouTube video series Sh*t Italian Moms Say. A self-proclaimed momma’s boy, his upbeat high-energy stand up comedy act captures his amazing and quirky life in the entertainment industry, as well as hilarious stories about his New York parents.
          </p>
          <p className={styles.sourcePlainContact}>@WhatsUpDanny | www.DanielFranzese.com</p>
          <h4>LIVE APPEARANCE CONTACT</h4>
          <p className={styles.sourcePlainContact}>
            Barbara Holliday | BHolliday@FlappersComedy.com<br />
            FLAPPERS Comedy, LLC | H2F Comedy Prods<br />
            102 E. Magnolia Blvd., Burbank, CA 91502<br />
            Phone: (818) 845-9721 Cell: (818) 679-2272<br />
            www.FlappersComedy.com
          </p>
        </article>

        <article id="tour-text-version" className={styles.textVersion} aria-labelledby="tour-text-heading" tabIndex={-1}>
          <h3 id="tour-text-heading">Yass! You’re Amazing! Comedy Tour - historical source text</h3>
          <p>
            Get ready for a side-splitting stand-up comedy show starring Daniel Franzese!
          </p>
          <p>
            You know him from starring in TV shows like HBO’s &quot;Looking&quot;, Freeform’s &quot;Recovery Road&quot;, ABC’s &quot;Conviction&quot; and movies like &quot;Bully&quot;, &quot;I Spit On Your Grave&quot; and of course when he stole our hearts as the lovable Damian in Paramount’s &quot;Mean Girls&quot;!
          </p>
          <p>
            You’ve seen him crack us up in hilarious moments on everything from &quot;The Comeback&quot;, &quot;Party Down&quot; and his mega YouTube smash, &quot;Sh*t Italian Moms Say&quot;, but now, come and see him as you’ve never seen him before with a no holds barred hot microphone!
          </p>
          <p>
            Originally from Brooklyn, Daniel has become a well-known proponent and speaker for the LGBTQ community and a leader for body positivity. A self-proclaimed Mama’s boy, his upbeat high energy stand-up comedy act captures his amazing and quirky life in the entertainment industry, as well as hilarious stories about his Italian parents from Brooklyn. Learn about his bilingual dog, if penguins have knees, his fear of Pompeii and a hilarious look on life in his new show.
          </p>
          <h4>Follow him on social media:</h4>
          <p className={styles.sourcePlainContact}>
            Twitter: @WhatsUpDanny<br />
            Instagram: @WhatsUpDanny<br />
            Facebook: Daniel Franzese<br />
            Pinterest: Daniel Franzese
          </p>
        </article>
      </Container>
    </section>
  )
}
