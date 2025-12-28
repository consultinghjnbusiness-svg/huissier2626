import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function TestSupabase() {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    async function fetchFees() {
      const { data, error } = await supabase.from('fees').select('*');
      if (error) {
        console.error('Erreur Supabase :', error);
      } else {
        setFees(data);
      }
    }
    fetchFees();
  }, []);

  return (
    <div>
      <h2>Frais récupérés depuis Supabase</h2>
      <ul>
        {fees.map(f => (
          <li key={f.id}>{f.act_type} : {f.montant} FCFA</li>
        ))}
      </ul>
    </div>
  );
}
