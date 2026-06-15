import numpy as np
import time

def pulse(Bz=50e-6, Bt=1e-6, Be=1e-6, cycles=20, dt=0.1):
    print("\n[PULSE] Engine heartbeat starting...\n")
    for i in range(cycles):
        t = i * dt
        B = (
            Bz * np.sin(0.5 * t) +
            Bt * np.cos(1.0 * t) +
            Be * np.sin(0.3 * t)
        )
        print(f"t={t:5.2f}   B_total={B:.8f} Tesla")
        time.sleep(dt)
    print("\n[PULSE] Engine heartbeat complete.\n")

if __name__ == "__main__":
    pulse()
