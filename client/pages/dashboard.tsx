import { gql } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

import client from '../apollo-client';
import Link from '../components/Link';
import { DashboardProps } from '../types';

export default function Dashboard({ user, polls }: DashboardProps) {
  return (
    <div className="container">
      <Head>
        <title>{user.name} / Poll App</title>
      </Head>
      <h1 className="font-semibold text-3xl text-center mb-2">Your Polls</h1>
      {polls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 overflow-hidden">
          {polls?.map((poll) => (
            <Link href={`/p/${poll.id}`} passHref key={poll.id}>
              <div className="p-2 flex flex-row items-center hover:bg-[#252525] rounded-lg space-x-3 transition ease-out">
                <Image src="/chart.png" width={50} height={50} alt="Chart" draggable={false} />
                <div className="flex flex-col max-w-[280px]">
                  <h2 className="hover:underline whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {poll.title}
                  </h2>
                  <p className="text-gray-400">
                    {formatDistanceToNowStrict(new Date(poll.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-lg text-center mt-2">You don&apos;t have any polls yet.</p>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session)
    return {
      notFound: true,
    };

  const {
    data: { getUserPolls },
  } = await client.query({
    query: GET_USER_POLLS,
    variables: { uid: session?.user?.uid },
  });

  return {
    props: {
      user: session.user,
      polls: getUserPolls,
    },
  };
};

const GET_USER_POLLS = gql`
  query userPolls($uid: String) {
    getUserPolls(uid: $uid) {
      id
      title
      createdAt
    }
  }
`;
