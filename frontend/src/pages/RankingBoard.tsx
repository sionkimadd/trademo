import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface UserRanking {
  userId: string;
  username: string;
  totalPnL: number;
}

export default function RankingBoard() {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const usersRef = collection(db, 'users');
          const usersSnapshot = await getDocs(usersRef);
          
          const rankingsData: UserRanking[] = [];
          for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;
            const userData = userDoc.data();

            const mainPortfolioRef = doc(db, `users/${userId}/portfolio/main`);
            const mainPortfolioSnap = await getDoc(mainPortfolioRef);

            let totalPnL = 0;
            if (mainPortfolioSnap.exists()) {
              const mainData = mainPortfolioSnap.data();
              totalPnL = mainData.total_profit_loss || 0;
            }

            rankingsData.push({
              userId,
              username: userData.displayName,
              totalPnL
            });
          }

          rankingsData.sort((a, b) => b.totalPnL - a.totalPnL);
          setRankings(rankingsData);
        } catch (error) {
          console.error('Ranking data error');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-[#0e101a] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Trade Ranking</h1>
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>P&L</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((ranking, index) => (
                <tr key={ranking.userId}>
                  <th>{index + 1}</th>
                  <td>{ranking.username}</td>
                  <td className={ranking.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${ranking.totalPnL.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 