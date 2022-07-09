import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Feed from "../../components/Feed";
import NavBar from "../../components/NavBar";
import Head from "next/head";

const Subs = ({ query }) => {
  return (
    <div>
      <Head>
        <title>
          {query?.frontsort ? `nottit · ${query?.frontsort}` : "nottit"}
        </title>
      </Head>

      <main className="">
          <Feed query={query} />
      </main>
    </div>
  );
};

Subs.getInitialProps = ({ query }) => {
  return { query };
};

export default Subs;
