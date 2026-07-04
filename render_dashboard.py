#!/usr/bin/env python3
import os

try:
    from pyvis.network import Network
    import networkx as nx
except ImportError:
    print("⏳ Loading unmanaged visual physics layout engine modules...")
    os.system("pip install pyvis networkx")
    from pyvis.network import Network
    import networkx as nx

print("🪐 [VISUAL CORE] Assembling interactive structural topology network...")

# Initialise 3D Physics Mesh Layout
net = Network(height="800px", width="100%%", bgcolor="#1a1a1a", font_color="#ffffff", directed=True)

# Define clean custom color palettes for your data nodes
c_human  = "#2ecc71" # Neon Green
c_engine = "#3498db" # Cyber Blue
c_nft    = "#9b59b6" # Amethyst Purple
c_wallet = "#f1c40f" # Amber Gold
c_hw     = "#e74c3c" # Crimson Red

# Insert Nodes with descriptive parameters and chromatic styling shapes
net.add_node("Operator", label="👤 backupsonbackups-cyber", title="Role: Sovereign Root Authority", color=c_human, shape="ellipse")
net.add_node("Engine", label="👻 robdoe.espVmark.ghost", title="Ledger: aiagency101.xyo", color=c_engine, shape="hexagon")
net.add_node("Domain1", label="🌐 robdoe.com", title="Classification: Primary Governance NFT", color=c_nft, shape="dot")
net.add_node("Domain2", label="🌐 roberdoe.pw", title="Classification: Secondary Governance Mirror", color=c_nft, shape="dot")
net.add_node("WalletC5", label="🔑 CELL 05 FIRE/EARTH", title="Address: 0x84CA4aFC3F395ebc0b519680B546Cd604C9c2018", color=c_wallet, shape="diamond")
net.add_node("WalletC6", label="🔑 CELL 06 AIR TENSOR", title="Address: 0xabf4e0A237E4632b1740fdBe118162aA33b4F5aD", color=c_wallet, shape="diamond")
net.add_node("WalletCL", label="🔑 CUSTODY LITE NODE", title="Address: 0x1AE2AF702063d304F8EBAC2153c91D79c62E381c", color=c_wallet, shape="diamond")
net.add_node("Hardware", label="📡 ESP32-C6 WROOM-1", title="Port: COM10 | State: LATCHED", color=c_hw, shape="box")

# Draw directional structural constraints vectors
net.add_edge("Operator", "Engine", title="COMMANDS", width=3, color="#ffffff")
net.add_edge("Engine", "Domain1", title="RESOLVES_TO", width=2)
net.add_edge("Engine", "Domain2", title="RESOLVES_TO", width=2)
net.add_edge("Engine", "WalletC5", title="SECURED_BY (Self-Custody)", width=2)
net.add_edge("Engine", "WalletC6", title="SECURED_BY (Self-Custody)", width=2)
net.add_edge("Engine", "WalletCL", title="SECURED_BY (Custody)", width=2)
net.add_edge("Engine", "Hardware", title="ATTESTS_ON", width=4, color="#e74c3c")

# Set up flexible fluid spring physics configurations
net.toggle_physics(True)

os.makedirs("derived_data", exist_ok=True)
output_file = "derived_data/topology_dashboard.html"
net.write_html(output_file)

print(f"   ✅ Interactive visualization successfully crystallized!")
print(f"   📂 Local web dashboard written: {output_file}")
