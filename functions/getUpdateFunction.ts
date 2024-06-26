/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 26.06.2024
 */

function getUpdateFunction(): string {
  return `  update() {
    const latencies = this.history.reduce<number[]>((n, { latency }) => (latency ? [...n, latency] : n), []);

    // Výpočet priemernej latencie
    const latency = latencies.reduce<number>((n, latency) => n + latency, 0) / latencies.length;

    this.setIntercomState({
      clientVersion: this.clientVersion,
      history: this.history,
      latencies,
      latency,
    });
  }`;
}

export default getUpdateFunction;
