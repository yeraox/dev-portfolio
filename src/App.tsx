import styles from './App.module.css';

// Placeholder until phase 5 builds the real title screen.
export default function App() {
  return (
    <main className={styles.placeholder}>
      <h1>Yeray Caturla</h1>
      <p>Backend Developer · Portfolio en construcción.</p>
      {import.meta.env.DEV && (
        <p>
          <a href="/dev/specimen">Abrir la página de muestra (fase 0)</a>
        </p>
      )}
    </main>
  );
}
