#!/usr/bin/env python3
"""
Complete Engine & Container Monitoring System
Shows all running cycles, containers, images, networks, and state
"""

import subprocess
import json
from datetime import datetime
from typing import Dict, List


class DockerMonitor:
    """Monitor Docker engines and containers"""
    
    @staticmethod
    def get_containers_detailed() -> List[Dict]:
        """Get all containers with full details"""
        result = subprocess.run(
            "docker ps -a --format json",
            shell=True,
            capture_output=True,
            text=True
        )
        
        if result.stdout:
            return json.loads("[" + result.stdout.strip().replace("\n", ",") + "]")
        return []
    
    @staticmethod
    def get_container_stats(container_id: str) -> Dict:
        """Get container CPU/memory stats"""
        try:
            result = subprocess.run(
                f"docker stats {container_id} --no-stream --format json",
                shell=True,
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.stdout:
                return json.loads(result.stdout)[0]
        except:
            pass
        return {}
    
    @staticmethod
    def get_images() -> List[Dict]:
        """Get all images"""
        result = subprocess.run(
            "docker images --format json",
            shell=True,
            capture_output=True,
            text=True
        )
        
        if result.stdout:
            return json.loads("[" + result.stdout.strip().replace("\n", ",") + "]")
        return []
    
    @staticmethod
    def get_networks() -> List[Dict]:
        """Get all networks"""
        result = subprocess.run(
            "docker network ls --format json",
            shell=True,
            capture_output=True,
            text=True
        )
        
        if result.stdout:
            return json.loads("[" + result.stdout.strip().replace("\n", ",") + "]")
        return []
    
    @staticmethod
    def get_volumes() -> List[Dict]:
        """Get all volumes"""
        result = subprocess.run(
            "docker volume ls --format json",
            shell=True,
            capture_output=True,
            text=True
        )
        
        if result.stdout:
            return json.loads("[" + result.stdout.strip().replace("\n", ",") + "]")
        return []


class EngineMonitorDashboard:
    """Complete engine monitoring dashboard"""
    
    def __init__(self):
        self.monitor = DockerMonitor()
        self.timestamp = datetime.utcnow().isoformat() + "Z"
    
    def build_dashboard(self) -> Dict:
        """Build complete monitoring dashboard"""
        containers = self.monitor.get_containers_detailed()
        images = self.monitor.get_images()
        networks = self.monitor.get_networks()
        volumes = self.monitor.get_volumes()
        
        # Separate running vs stopped
        running = [c for c in containers if c.get("State") == "running"]
        stopped = [c for c in containers if c.get("State") != "running"]
        
        dashboard = {
            "timestamp": self.timestamp,
            "summary": {
                "total_containers": len(containers),
                "running_containers": len(running),
                "stopped_containers": len(stopped),
                "total_images": len(images),
                "total_networks": len(networks),
                "total_volumes": len(volumes)
            },
            "running_engines": self.analyze_engines(running),
            "containers": {
                "running": running,
                "stopped": stopped
            },
            "images": images,
            "networks": networks,
            "volumes": volumes
        }
        
        return dashboard
    
    def analyze_engines(self, running_containers: List[Dict]) -> Dict:
        """Analyze running engine containers"""
        engines = {}
        
        for container in running_containers:
            image = container.get("Image", "")
            name = container.get("Names", "").strip("/")
            container_id = container.get("ID", "")
            
            # Classify engines
            if "engine" in image.lower() or "engine" in name.lower():
                stats = self.monitor.get_container_stats(container_id)
                
                engines[name] = {
                    "image": image,
                    "status": "running",
                    "ports": container.get("Ports", ""),
                    "cpu": stats.get("CPUPerc", "N/A"),
                    "memory": stats.get("MemUsage", "N/A"),
                    "created": container.get("CreatedAt", ""),
                    "state": container.get("State", "")
                }
        
        return engines
    
    def generate_report(self) -> str:
        """Generate human-readable monitoring report"""
        dashboard = self.build_dashboard()
        summary = dashboard["summary"]
        engines = dashboard["running_engines"]
        
        report = f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                     🔍 DOCKER ENGINE MONITORING DASHBOARD                    ║
║                         {self.timestamp}                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Containers:     {summary['total_containers']}
  Running:              {summary['running_containers']} ✅
  Stopped:              {summary['stopped_containers']} ⏸️
  Total Images:         {summary['total_images']}
  Total Networks:       {summary['total_networks']}
  Total Volumes:        {summary['total_volumes']}

🔧 ACTIVE ENGINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        
        if engines:
            for engine_name, engine_info in engines.items():
                report += f"""
  ⚙️  {engine_name}
      Image:       {engine_info['image']}
      Status:      {engine_info['state']}
      CPU:         {engine_info['cpu']}
      Memory:      {engine_info['memory']}
      Ports:       {engine_info['ports'] if engine_info['ports'] else 'N/A'}
"""
        else:
            report += "  No active engines detected\n"
        
        report += f"""
🐳 RUNNING CONTAINERS ({summary['running_containers']})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        
        for container in dashboard["containers"]["running"]:
            name = container.get("Names", "").strip("/")
            image = container.get("Image", "")
            ports = container.get("Ports", "N/A")
            report += f"  • {name}\n    Image: {image}\n    Ports: {ports}\n"
        
        report += f"""
⏸️  STOPPED CONTAINERS ({summary['stopped_containers']})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        
        for container in dashboard["containers"]["stopped"]:
            name = container.get("Names", "").strip("/")
            image = container.get("Image", "")
            report += f"  • {name} ({image})\n"
        
        report += f"""
🖼️  IMAGES ({summary['total_images']})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        
        for image in dashboard["images"][:10]:
            repo = image.get("Repository", "N/A")
            tag = image.get("Tag", "N/A")
            size = image.get("Size", "N/A")
            report += f"  • {repo}:{tag} ({size})\n"
        
        if len(dashboard["images"]) > 10:
            report += f"  ... and {len(dashboard['images']) - 10} more\n"
        
        report += f"""
🌐 NETWORKS ({summary['total_networks']})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        
        for network in dashboard["networks"]:
            name = network.get("Name", "N/A")
            driver = network.get("Driver", "N/A")
            report += f"  • {name} ({driver})\n"
        
        report += f"""
💾 VOLUMES ({summary['total_volumes']})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        
        for volume in dashboard["volumes"]:
            name = volume.get("Name", "N/A")
            driver = volume.get("Driver", "N/A")
            report += f"  • {name} ({driver})\n"
        
        report += f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                         ✅ MONITORING COMPLETE                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""
        
        return report
    
    def export_dashboard(self, output_file: str = "engine-dashboard.json"):
        """Export dashboard to JSON"""
        dashboard = self.build_dashboard()
        
        with open(output_file, 'w') as f:
            json.dump(dashboard, f, indent=2)
        
        return dashboard


def main():
    print("\n" + "=" * 80)
    print("🔍 DOCKER ENGINE & CONTAINER MONITORING")
    print("=" * 80)
    
    dash = EngineMonitorDashboard()
    
    # Generate and print report
    report = dash.generate_report()
    print(report)
    
    # Export JSON
    print("\n[*] Exporting to engine-dashboard.json...")
    dash.export_dashboard()
    print("✓ Dashboard exported")


if __name__ == "__main__":
    main()
