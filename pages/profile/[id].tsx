import { LevelModel, ReviewModel, UserModel } from '../../models/mongoose';
import FormattedReview from '../../components/formattedReview';
import { GetServerSidePropsContext } from 'next';
import Level from '../../models/db/level';
import Page from '../../components/page';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import Review from '../../models/db/review';
import { SWRConfig } from 'swr';
import SkeletonPage from '../../components/skeletonPage';
import UniverseTable from '../../components/universeTable';
import User from '../../models/db/user';
import dbConnect from '../../lib/dbConnect';
import getFormattedDate from '../../helpers/getFormattedDate';
import getSWRKey from '../../helpers/getSWRKey';
import useLevelsByUserId from '../../hooks/useLevelsByUserId';
import useReviewsByUserId from '../../hooks/useReviewsByUserId';
import { useRouter } from 'next/router';
import useUserById from '../../hooks/useUserById';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

interface ProfileParams extends ParsedUrlQuery {
  id: string;
}

export async function getStaticProps(context: GetServerSidePropsContext) {
  await dbConnect();

  const { id } = context.params as ProfileParams;
  const [levels, reviews, user] = await Promise.all([
    LevelModel.find<Level>({ isDraft: false, userId: id }, 'name').sort({ name: 1 }),
    ReviewModel.find<Review>({ userId: id })
      .populate('levelId', '_id name').sort({ ts: -1 }),
    UserModel.findById<User>(id, '-password'),
  ]);

  if (!levels) {
    throw new Error('Error finding Levels by userId');
  }

  if (!reviews) {
    throw new Error('Error finding Levels by userId');
  }

  if (!user || user.isOfficial) {
    throw new Error(`Error finding User ${id}`);
  }

  return {
    props: {
      levels: JSON.parse(JSON.stringify(levels)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      user: JSON.parse(JSON.stringify(user)),
    } as ProfileProps,
    revalidate: 60 * 60,
  };
}

interface ProfileProps {
  levels: Level[];
  reviews: Review[];
  user: User | undefined;
}

export default function Profile({ levels, reviews, user }: ProfileProps) {
  const router = useRouter();
  const { id } = router.query;

  if (router.isFallback || !id) {
    return <SkeletonPage/>;
  }

  return (
    <SWRConfig value={{ fallback: {
      [getSWRKey(`/api/levels-by-user-id/${id}`)]: levels,
      [getSWRKey(`/api/reviews-by-user-id/${id}`)]: reviews,
      [getSWRKey(`/api/user-by-id/${id}`)]: user,
    } }}>
      <ProfilePage/>
    </SWRConfig>
  );
}

function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { levels } = useLevelsByUserId(id);
  const { reviews } = useReviewsByUserId(id);
  const { user } = useUserById(id);

  if (user === null) {
    return <span>User not found!</span>;
  } else if (!user) {
    return <span>Loading...</span>;
  }

  return (
    <Page title={`${user.name}'s profile`}>
      <div
        style={{
          padding: 10,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            margin: '0 0 20px 0',
          }}
        >
          {user.ts ?
            <>
              <span>{`Account created: ${getFormattedDate(user.ts, false)}`}</span>
              <br/>
              <span>{`${user.name} has completed ${user.score} level${user.score !== 1 ? 's' : ''}`}</span>
              <br/>
            </>
            : null
          }
        </div>
        {!levels || levels.length === 0 ? null :
          <UniverseTable
            levels={levels}
            user={user}
          />
        }
        <div
          style={{
            margin: 20,
          }}
        >
          {reviews && reviews.length > 0 ?
            <div className='text-lg'>
              {`${user.name}'s reviews (${reviews.length}):`}
            </div>
            : null
          }
        </div>
        {reviews?.map((review, index) => {
          return (
            <div
              key={index}
              style={{
                margin: 20,
              }}
            >
              <FormattedReview
                level={review.levelId}
                review={review}
              />
            </div>
          );
        })}
      </div>
    </Page>
  );
}
