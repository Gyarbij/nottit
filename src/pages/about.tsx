/* eslint-disable @next/next/no-img-element */

import Head from "next/head";
import Link from "next/link";
import { AiOutlineGithub } from "react-icons/ai";
import packageInfo from "../../package.json";
const VERSION = packageInfo.version;
const link = "text-th-link hover:underline hover:text-th-linkHover "
const AboutPage = ({ changelog }) => {
  return (
    <div className="h-screen mx-4 -mt-16">
      <Head>
        <title>nottit · about</title>
      </Head>
      <div className="h-full text-justify text-th-text ">
        <div className="flex flex-col justify-center max-w-xl min-h-full gap-4 mx-auto space-y-1 overflow-y-scroll scrollbar-none ">
          <p className="">
            Nottit is a web app for Reddit that gets rid off all the extra
            curicular bullshit that's taken over the site. Follow subreddits and users locally
            or login with your Reddit account to vote, comment, and manage your
            existing subscriptions.
          </p>

          <p className="">
            This site not affiliated with Reddit. All content
            on this site is fetched from the public [Reddit API](https://www.reddit.com/dev/api/).
          </p>

          <p className="">
            For any feature requests, bug reports, or general conversation head
            over to <Link href={"/r/nottit"}><a className={link}>r/nottit</a></Link>.
            You can also create an issue on{" "}
            <a
              href="https://github.com/Gyarbij/nottit"
              target="_blank"
              rel="noreferrer"
              className={link}
            >
              GitHub
            </a>{" "}
            or contact me at{" "}
            <a
              className={link}
              href="mailto: gyarbij@pm.me"
            >
              gyarbij@pm.me
            </a> for anything else.
          </p>
          <p className="">
            <Link href={"/changelog"}>
              <a className="flex flex-wrap justify-between pt-5 font-semibold hover:underline">
                <h4>v{VERSION}</h4>
                <h4>See Changelog</h4>
              </a>
            </Link>
          </p>
        </div>
        <div className="absolute left-0 w-full bottom-5 sm:bottom-20">
          <div className="flex items-center justify-between max-w-xl mx-4 sm:mx-auto">
            <a
              href="https://github.com/Gyarbij/nottit"
              target="_blank"
              rel="noreferrer"
              className="hover:cursor-pointer"
            >
              <AiOutlineGithub className="w-12 h-12 transition-all hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
