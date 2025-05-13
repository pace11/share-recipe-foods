import HomeContainer from '@/containers/home-container'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

export default function Home() {
  return <HomeContainer />
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const cookies = parse(context.req.headers.cookie || '')
  const token = cookies?.user_token
    ? jwt.verify(cookies.user_token, process.env.SECRET_KEY!)
    : false

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
