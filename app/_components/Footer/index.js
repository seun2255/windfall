import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
import icons from "@/app/_assets/icons/icons";

export default function Footer() {
  // Scrolls the user back to the top of the page
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo__box}>
        <div className={styles.logo} onClick={handleLogoClick}>
          W
          <span>
            <div className={styles.flower}>
              <Image src={"/img/common/flower.png"} alt="logo" fill />
            </div>
            I
          </span>
          NDFALL
        </div>

        <span>© Windfall 2023</span>
        <div className={styles.socials}>
          <Link href={"https://twitter.com/WindfallStaking"} target="_blank">
            <div className={styles.social__icon}>
              <Image src={icons.twitter} alt="social icon" fill />
            </div>
          </Link>
          <Link href={"https://discord.gg/KUThbg7Bnx"} target="_blank">
            <div className={styles.social__icon}>
              <Image src={icons.discord} alt="social icon" fill />
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.link__box}>
          <h4>Policies</h4>
          <Link
            href={
              "https://app.gitbook.com/o/kJtfy5OqPfuA6aeBb99F/s/p4yUSk23AubmL5kX5Stz/additional-information/disclaimer"
            }
            target="_blank"
          >
            <p>Disclaimer</p>
          </Link>
          <Link
            href={
              "https://app.gitbook.com/o/kJtfy5OqPfuA6aeBb99F/s/p4yUSk23AubmL5kX5Stz/additional-information/privacy-policy"
            }
            target="_blank"
          >
            <p>Privacy Policy</p>
          </Link>
          <Link href={"/"}>
            <p>Terms of Service</p>
          </Link>
        </div>
        <div className={styles.link__box}>
          <h4>Resources</h4>
          <Link href={"/"}>
            <p>FAQ</p>
          </Link>
          <Link
            href={
              "https://app.gitbook.com/o/kJtfy5OqPfuA6aeBb99F/s/p4yUSk23AubmL5kX5Stz/"
            }
            target="_blank"
          >
            <p>Docs</p>
          </Link>
        </div>
        <div className={styles.link__box}>
          <h4>Support</h4>
          <Link
            href={
              "https://app.gitbook.com/o/kJtfy5OqPfuA6aeBb99F/s/p4yUSk23AubmL5kX5Stz/additional-information/need-help"
            }
            target="_blank"
          >
            <p>Contact us</p>
          </Link>
          <Link href={"/"}>
            <p>Report a bug</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
