export function ArticleChatGPTvsPrivada() {
  return (
    <>
      <p>
        ChatGPT ha canviat la manera de treballar de milions de professionals. Però per a empreses que treballen amb dades sensibles, la pregunta clau no és "és útil?" sinó "és segur?". En aquest article comparem, punt per punt, les eines d'IA al núvol amb les solucions d'IA privada instal·lades al teu servidor.
      </p>

      <h2>La comparativa completa</h2>

      <div style={{
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        margin: '32px 0',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          padding: '14px 20px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Aspecte</span>
          <span style={{ color: 'rgba(239,68,68,0.6)', textAlign: 'center' }}>ChatGPT / Copilot</span>
          <span style={{ color: '#06b6d4', textAlign: 'center' }}>IA Privada</span>
        </div>
        {[
          ['On viuen les teves dades?', 'Servidors als EUA', 'Al teu despatx'],
          ['Cost mensual', '20-200€/usuari', '0€ (pagament únic)'],
          ['Coneix el teu negoci?', 'No — és genèrica', 'Sí — fine-tuning'],
          ['GDPR garantit?', 'Depèn del proveïdor', '100% natiu'],
          ['Funciona offline?', 'No', 'Sí'],
          ['Suport tècnic', 'Ticket online, dies', 'Presencial, <4h'],
          ['Actualitzacions', 'Imposades pel proveïdor', 'Tu decideixes quan'],
        ].map(([aspect, cloud, local], i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            padding: '12px 20px',
            borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            fontSize: 14,
          }}>
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>{aspect}</span>
            <span style={{ color: 'rgba(239,68,68,0.5)', textAlign: 'center' }}>{cloud}</span>
            <span style={{ color: '#06b6d4', textAlign: 'center', fontWeight: 500 }}>{local}</span>
          </div>
        ))}
      </div>

      <h2>On guanya ChatGPT</h2>
      <p>
        Siguem honestos: ChatGPT té avantatges reals. És immediat — et registres i en 30 segons ja estàs treballant. No necessites instal·lar res. I els models d'OpenAI són excel·lents per a tasques generals: redactar correus, traduir textos o fer brainstorming.
      </p>
      <p>
        Per a un freelance que treballa des de casa amb dades no sensibles, ChatGPT pot ser perfecte. El problema apareix quan escales: més usuaris, dades confidencials, requisits legals i costos que creixen cada mes.
      </p>

      <h2>On guanya la IA privada</h2>

      <h3>Privacitat i control</h3>
      <p>
        Amb ChatGPT, cada consulta és una transferència de dades a OpenAI. Amb IA privada, les dades mai surten del teu despatx. Per a advocats, metges, financers o qualsevol professional que treballi amb dades sensibles, aquesta diferència no és negociable.
      </p>

      <h3>Cost a llarg termini</h3>
      <p>
        Un equip de 10 persones amb ChatGPT Enterprise paga uns 600€/mes — 7.200€/any. Amb IA privada, fas un únic pagament i no tornes a pagar. En 12-18 mesos, la inversió ja s'ha amortitzat.
      </p>

      <h3>Precisió per al teu negoci</h3>
      <p>
        ChatGPT sap de tot una mica. Però no coneix els teus clients, els teus processos ni la teva terminologia. Una IA privada amb fine-tuning ha estat entrenada amb els teus documents reals: contractes, informes, correus, procediments. Les respostes són radicalment més precises i rellevants.
      </p>

      <h3>Independència tecnològica</h3>
      <p>
        Quan OpenAI canvia preus, modifica el model o talla funcionalitats, no tens cap opció. Amb IA privada, el servidor és teu, el model és teu i les actualitzacions les decideixes tu. No depens de les decisions d'una empresa a San Francisco.
      </p>

      <h2>Per a qui és cada opció?</h2>

      <h3>ChatGPT és per a tu si:</h3>
      <ul>
        <li>Treballes sol o amb un equip molt petit</li>
        <li>No maneges dades sensibles de clients</li>
        <li>No tens requisits legals estrictes de privacitat</li>
        <li>Necessites alguna cosa immediata i temporal</li>
      </ul>

      <h3>IA privada és per a tu si:</h3>
      <ul>
        <li>Treballes amb dades confidencials (legals, mèdiques, financeres)</li>
        <li>Necessites compliment GDPR garantit</li>
        <li>Vols una IA que conegui el teu negoci específic</li>
        <li>Prefereixes un cost fix sense sorpreses mensuals</li>
        <li>Valores tenir suport tècnic presencial i ràpid</li>
      </ul>

      <h2>El veredicte</h2>
      <p>
        ChatGPT és una eina excel·lent per a ús personal i tasques generals. Però per a empreses que treballen amb informació sensible i necessiten una IA que realment entengui el seu negoci, la IA privada és la solució natural. No és millor ni pitjor — és diferent. I per a professionals a Barcelona que valoren la privacitat, el control i l'estalvi a llarg termini, la diferència és decisiva.
      </p>
    </>
  );
}
