import { useMainContext } from "../../MainContext";
import Link from "next/dist/client/link";
import { BiComment } from "react-icons/bi";
import { numToString, secondsToTime } from "../../../lib/utils";
import Image from "next/dist/client/image";
import { useState } from "react";

import { BiExit } from "react-icons/bi";
import { ImReddit } from "react-icons/im";
import { BsCardText } from "react-icons/bs";
import { AiOutlineLink } from "react-icons/ai";
import { CgArrowsExpandDownRight, CgArrowsExpandUpLeft } from "react-icons/cg";
import TitleFlair from "../TitleFlair";
import Vote from "../Vote";
import MediaWrapper from "../MediaWrapper";
import Awardings from "../Awardings";
import PostTitle from "../PostTitle";
import SaveButton from "../SaveButton";
import { hideLink } from "../../RedditAPI";
import HideButton from "../HideButton";
import PostOptButton from "../PostOptButton";
import { GoRepoForked } from "react-icons/go";
const Row1 = ({
  post,
  hasMedia,
  hideNSFW,
  forceMute,
  postNum,
  read,
  handleClick,
}) => {
  const context: any = useMainContext();
  const [expand, setexpand] = useState(false);

  return (
    <div
      onClick={(e) => handleClick(e)}
      className={
        (postNum === 0 ? " border-t rounded-t-md " : " ") +
        "flex flex-row items-start py-1 pb-2 text-sm bg-th-post2 hover:bg-th-postHover group border-l border-r border-transparent hover:border-th-borderHighlight2   "
      }
    >
      {/* Votes */}
      <div
        className={
          (post?.link_flair_richtext?.length > 0 && "mt-2") +
          " flex flex-row items-center justify-center "
        }
      >
        <div className="flex flex-row items-center justify-center">
          <div className="flex-col items-center self-start justify-start flex-none hidden h-full pt-1 w-14 md:flex">
            <Vote
              likes={post?.likes}
              score={post?.score ?? 0}
              name={post?.name}
              postindex={postNum}
              archived={post?.archived}
            />
          </div>
        </div>
        {/* Thumbnail */}
        <a
          href={
            `${post?.url?.replace("reddit.com", "nottit.com")}` ??
            `https://nottit.com${post?.permalink}`
          }
          target={"_blank"}
          rel="noreferrer"
          onClick={(e) => {
            // e.stopPropagation();
            e.preventDefault();
          }}
        >
          <div
            className={
              "relative flex items-center justify-center flex-none w-24 h-16 mt-2 rounded-md overflow-hidden" +
              (post?.thumbnail == "self" ||
              post?.thumbnail == "default" ||
              post?.thumbnail == "nsfw" ||
              post?.thumbnail == "spoiler"
                ? " border rounded-md"
                : " border border-transparent ") +
              (hideNSFW && " overflow-hidden")
            }
          >
            {post?.thumbnail !== "self" &&
            post?.thumbnail !== "default" &&
            post?.thumbnail &&
            post?.thumbnail !== "nsfw" &&
            post?.thumbnail !== "spoiler" ? (
              <div className={hideNSFW && ""}>
                <Image
                  src={post?.thumbnail}
                  alt=""
                  layout={"intrinsic"}
                  priority={true}
                  height={post?.thumbnail_height}
                  width={post?.thumbnail_width}
                  unoptimized={true}
                  className={"rounded-md " + (hideNSFW && " blur")}
                ></Image>
              </div>
            ) : post?.thumbnail == "self" ? (
              <BsCardText className="w-6 h-6" />
            ) : (
              <AiOutlineLink className="w-6 h-6" />
            )}
          </div>
        </a>
      </div>
      <div className="flex flex-col flex-grow pr-2 mt-2 ml-2">
        {/* Title */}
        <div>
          <h1
            className={
              " text-base leading-none cursor-pointer select-auto flex flex-row items-center gap-2 flex-wrap"
            }
          >
            <h1>
              {(post?.link_flair_text?.length > 0 ||
                post?.link_flair_richtext?.length > 0) && (
                <span className="mr-2 text-xs font-medium">
                  <TitleFlair post={post} />
                </span>
              )}
              <a href={post?.permalink} onClick={(e) => e.preventDefault()}>
                <span
                  className={
                    " group-hover:underline font-semibold text-base " +
                    (post?.distinguished == "moderator" || post?.stickied
                      ? " text-th-green "
                      : " ") +
                    (read && context.dimRead ? " opacity-50" : "")
                  }
                >{`${post?.title ?? ""}`}</span>
              </a>
            </h1>

            {/* <a
              href={post?.permalink}
              onClick={(e) => e.preventDefault()}
              className={" font-semibold"}
            >
              <PostTitle post={post} />
            </a> */}
          </h1>
        </div>
        {/* Info */}
        <div className="flex flex-row flex-wrap items-center pt-1 text-xs truncate text-th-textLight ">
          <Link href={`/r/${post?.subreddit}`}>
            <a
              className="mr-1"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h2 className="hover:underline">r/{post?.subreddit ?? "ERR"}</h2>
            </a>
          </Link>
          {post?.crosspost_parent_list?.[0] ? (
            <div className="flex flex-row gap-1">
              <GoRepoForked className="flex-none w-4 h-4 rotate-90" />
              <span className="italic font-semibold">crosspost by</span>
            </div>
          ) : (
            <p>•</p>
          )}
          <Link href={`/u/${post?.author}`}>
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h2 className="ml-1 mr-1 hover:underline">
                u/{post?.author ?? ""}
              </h2>
            </a>
          </Link>
          <p>•</p>

          <p className="ml-1">
            {secondsToTime(post?.created_utc, [
              "s ago",
              "min ago",
              "hr ago",
              "dy ago",
              "mo ago",
              "yr ago",
            ])}
          </p>
          {post?.over_18 && (
            <div className="flex flex-row pl-1 space-x-1">
              <p>•</p>
              <span className="text-th-red">NSFW</span>
            </div>
          )}
          {post?.spoiler && (
            <div className="flex flex-row pl-1 space-x-1">
              <p>•</p>
              <span className="text-th-red">SPOILER</span>
            </div>
          )}
          <div className="mx-0.5"></div>
          {post?.all_awardings?.length > 0 && (
            <>
              <div className="ml-0.5"></div>
              <Awardings
                all_awardings={post?.all_awardings}
                styles="mr-0.5 -mb-0.5"
              />
            </>
          )}
          <span className="ml-auto text-xs font-xs hover:underline">
            <a
              title="open source"
              href={`${post.url}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >{`(${post?.domain})`}</a>
          </span>
        </div>
        {/* Links */}
        <div>
          <div className="flex flex-row flex-wrap items-center justify-start pb-1 space-x-1 text-xs select-none text-th-text ">
            <button
              className={
                "flex flex-row items-center h-6 px-1 space-x-1 border rounded-md border-th-border hover:border-th-borderHighlight opacity-60 " +
                (!hasMedia &&
                  !post?.selftext_html &&
                  "opacity-0 cursor-default")
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                !(!hasMedia && !post?.selftext_html) && setexpand((s) => !s);
              }}
            >
              {hasMedia || post?.selftext_html ? (
                <>
                  {expand ? (
                    <CgArrowsExpandUpLeft className="flex-none w-4 h-4" />
                  ) : (
                    <CgArrowsExpandDownRight className="flex-none w-4 h-4" />
                  )}
                </>
              ) : (
                <AiOutlineLink />
              )}
            </button>

            <a href={post?.permalink} onClick={(e) => e.preventDefault()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClick(e, true);
                }}
                className="flex flex-row items-center px-2 py-1 h-[26px] space-x-1 border border-transparent rounded-md  hover:border-th-borderHighlight opacity-60  "
              >
                <BiComment className="flex-none w-4 h-4 " />
                <h1 className="">{`${
                  numToString(post?.num_comments, 1000) ?? "??"
                }`}</h1>
                <h1 className="hidden md:block">{`${
                  post?.num_comments === 1 ? "comment" : "comments"
                }`}</h1>
              </button>
            </a>
            <div className="flex flex-row items-center px-2 h-[26px] py-1 border border-transparent rounded-md  hover:border-th-borderHighlight opacity-60  hover:cursor-pointer ">
              <SaveButton
                id={post?.name}
                saved={post?.saved}
                row={true}
                isPortrait={false}
                postindex={postNum}
              />
            </div>
            <div className="flex flex-row items-center px-2 h-[26px] py-1 border border-transparent rounded-md hover:border-th-borderHighlight opacity-60 hover:cursor-pointer ">
              <HideButton
                id={post?.name}
                hidden={post?.hidden}
                row={true}
                isPortrait={false}
                postindex={postNum}
              />
            </div>
            <a
              href={`${post?.url}` ?? "https://nottit.com"}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex flex-row h-[26px] items-center px-2 py-1 space-x-1 border border-transparent rounded-md hover:border-th-borderHighlight opacity-60 ">
                <BiExit className="flex-none w-4 h-4 " />
                <h1 className="hidden md:block">Source</h1>
              </div>
            </a>
            <a
              href={`https://www.reddit.com${post?.permalink ?? ""}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex flex-row h-[26px] items-center px-2 py-1 space-x-1 border border-transparent rounded-md hover:border-th-borderHighlight opacity-60 ">
                <ImReddit className="flex-none w-4 h-4 mb-0.5" />
                <h1 className="hidden md:block ">Original</h1>
              </div>
            </a>
            <div className="flex-grow md:flex-grow-0"></div>
            <div className="text-th-textLight">
              <PostOptButton post={post} postNum={postNum} mode={"row"} />
            </div>
          </div>
        </div>
        {/* Hidden Media */}

        {expand && (
          <div
            className={
              "block p-1 border-th-border md:border-l origin-top  " +
              (hideNSFW && " overflow-hidden relative")
            }
          >
            <a
              href={post?.permalink}
              onClick={(e) => e.preventDefault()}
              onMouseDown={(e) => e.preventDefault()}
            >
              <MediaWrapper
                hideNSFW={hideNSFW}
                post={post}
                forceMute={forceMute}
                postMode={false}
                imgFull={false}
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Row1;
