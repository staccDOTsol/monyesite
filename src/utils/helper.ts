import Moralis from 'moralis';

const getAttempts = async () => {
  const currentUser = Moralis.User.current();
  if (currentUser) {
    const ethAddress = currentUser.get('ethAddress');
    const user = new Moralis.Query(Moralis.User);
    user.equalTo('ethAddress', ethAddress);
    const fetchUser = await user.first();
    if (fetchUser) {
      return fetchUser.get('attempt');
    }
  }
  return 0;
};

const addAttempts = async (attempts: number) => {
  const currentUser = Moralis.User.current();
  console.log(1)
  if (currentUser) {
    console.log(12)
    const ethAddress = currentUser.get('ethAddress');
    const user = new Moralis.Query(Moralis.User);
    user.equalTo('ethAddress', ethAddress);
    const fetchUser = await user.first();
    console.log(16)
    if (fetchUser) {
      console.log(17)
      console.log(fetchUser)
      const totalAttempts = attempts + fetchUser.get('attempt');
    console.log(totalAttempts)
      fetchUser.set('attempt', totalAttempts);
      console.log(222)
      await fetchUser.save();
      console.log(333)
    }
  }
};

const reduceAttempts = async () => {
  const currentUser = Moralis.User.current();
  if (currentUser) {
    const attempts = await getAttempts();
    if (attempts > 0) {
      currentUser.set('attempt', attempts - 1);
      currentUser.save();
    }
  }
};

const getUser = async (ethAddress: string) => {
  const user = new Moralis.Query(Moralis.User);
  user.equalTo('ethAddress', ethAddress);
  const fetchUser = await user.first();
  return fetchUser;
};

const saveScore = async (score: number) => {
  const currentUser = Moralis.User.current();
  if (currentUser) {
    const ethAddress = currentUser.get('ethAddress');
    const attempts = await getAttempts();
    const user = await getUser(ethAddress);
    if (user) {
      saveLeaderboard(ethAddress, score);
    }
  }
};

const saveLeaderboard = async (ethAddress: string, score: number) => {
  const leaderboard = Moralis.Object.extend('leaderboard');
  let query = new Moralis.Query(leaderboard);
  query.equalTo('ethAddress', ethAddress);
  const fetchLeaderboard = await query.first();
  if (fetchLeaderboard) {
    const s = fetchLeaderboard.get('score');
    if (s <= score) {
      fetchLeaderboard.set('score', score);
      fetchLeaderboard.save();
    }
  } else {
    const newLeaderboard = new leaderboard();
    newLeaderboard.set('ethAddress', ethAddress);
    newLeaderboard.set('score', score);
    newLeaderboard.save();
  }
  query = new Moralis.Query(leaderboard);
  const result = await query.find();
  if (result) {
    const sorted = result.sort((a, b) => {
      return b.get('score') - a.get('score');
    });
    for (let i = 0; i < sorted.length; i++) {
      const leaderboard = sorted[i];
      leaderboard.set('rank', i + 1);
      leaderboard.save();
    }
  }
};

const getRank = async (ethAddress: string) => {
  const leaderboard = Moralis.Object.extend('leaderboard');
  let query = new Moralis.Query(leaderboard);
  query.equalTo('ethAddress', ethAddress);
  const fetchLeaderboard = await query.first();
  if (fetchLeaderboard) {
    return fetchLeaderboard.get('rank');
  }
  return 0;
};

const getLeaderboard = async () => {
  const leaderboard = Moralis.Object.extend('leaderboard');
  let query = new Moralis.Query(leaderboard);
  const result = await query.find();
  if (result) {
    const sorted = result
      .sort((a, b) => {
        return b.get('score') - a.get('score');
      })
      .slice(0, 10);
    return sorted;
  }
  return [];
};

export {
  getUser,
  getAttempts,
  reduceAttempts,
  saveScore,
  addAttempts,
  getRank,
  getLeaderboard,
};
