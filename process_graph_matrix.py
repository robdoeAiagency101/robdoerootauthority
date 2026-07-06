import pandas as pd
import numpy as np
import math
import json
import os
from neo4j import GraphDatabase

# Structural Constraints - Locked to Cycle 1 parameters
K_COUPLING = 0.075 # AHA Harmonic Layer Constant
URI = "bolt://localhost:7687"
AUTH = ("neo4j", "password")

class KuramotoGraphProcessor:
    def __init__(self):
        try:
            self.driver = GraphDatabase.driver(URI, auth=AUTH)
            print("[+] Neo4j Database Authority Online.")
        except Exception as e:
            print(f"[!] Connection refused: {e}")
            self.driver = None

    def process_csv_matrix(self, filepath):
        if not os.path.exists(filepath):
            print(f"[!] Target storage ledger matrix missing at: {filepath}")
            return
        if self.driver is None:
            print("[!] Neo4j driver not initialized. Skipping ingestion.")
            return
            
        print(f"[*] Ingesting flat file logs from: {filepath}")
        df = pd.read_csv(filepath)
        
        # Unwind and convert raw payload length matrices to phase angles (0 to 2*Pi)
        with self.driver.session() as session:
            for idx, row in df.iterrows():
                length_scalar = float(row['Length'])
                calculated_theta = (length_scalar * 0.0174533) % (2 * math.pi)
                epoch_tick = int(row['Epoch'])
                
                # Execute non-forced topological insertion
                cypher = """
                MERGE (h:HexCell {hex_id: 'HEX_Q0_R' + toString($idx % 7)})
                ON MATCH SET h.theta = $theta, h.last_sync = $epoch
                ON CREATE SET h.q = $idx % 7, h.r = -$idx % 7, h.theta = $theta, h.omega = 0.5, h.node_id = 'espVmark.robdoe.32'
                """
                session.run(cypher, idx=idx, theta=calculated_theta, epoch=epoch_tick)
                
        print("[Hex Matrix Mapped] All raw parameters successfully mapped to phase vectors inside Neo4j.")

if __name__ == '__main__':
    processor = KuramotoGraphProcessor()
    processor.process_csv_matrix("derived_data\\jubilee_telemetry_matrix.csv")
    if processor.driver: processor.driver.close()
