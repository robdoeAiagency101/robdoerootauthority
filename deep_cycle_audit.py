#!/usr/bin/env python3
"""
DEEP CYCLE AUDIT SCRIPT
Monitors engine-365-days, ultimate-engine, tenetaiagency-101
Checks logs, metrics, audit trails, and operational state
"""

import subprocess
import json
import time
from datetime import datetime
from typing import Dict, Any, List


class DeepCycleAudit:
    """Deep audit of engine cycles"""
    
    def __init__(self):
        self.engines = [
            "engine-365-days",
            "ultimate-engine",
            "tenetaiagency-101",
        ]
        self.log_paths = {
            "engine-365-days": "/logs/cycles.log",
            "ultimate-engine": "/logs/ultimate_sovereign_audit.jsonl",
            "tenetaiagency-101": "/logs/audit.log",
        }
        self.metrics_paths = {
            "engine-365-days": "/logs/metrics.json",
            "ultimate-engine": "/logs/ultimate_sovereign_metrics.json",
            "tenetaiagency-101": "/logs/metrics.json",
        }
        self.audit_report = {}
    
    def run_command(self, cmd: str) -> str:
        """Run shell command"""
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
            return result.stdout + result.stderr
        except Exception as e:
            return f"Error: {str(e)}"
    
    def check_engine_logs(self, engine: str) -> Dict[str, Any]:
        """Check last 5 lines of engine logs"""
        log_path = self.log_paths.get(engine, "/logs/default.log")
        cmd = f"tail -5 {log_path}"
        
        output = self.run_command(cmd)
        return {
            "engine": engine,
            "log_path": log_path,
            "last_5_lines": output.strip().split('\n') if output else [],
        }
    
    def check_engine_metrics(self, engine: str) -> Dict[str, Any]:
        """Check engine metrics"""
        metrics_path = self.metrics_paths.get(engine, "/logs/metrics.json")
        cmd = f"cat {metrics_path}"
        
        output = self.run_command(cmd)
        try:
            metrics = json.loads(output) if output else {}
        except:
            metrics = {"raw": output}
        
        return {
            "engine": engine,
            "metrics_path": metrics_path,
            "metrics": metrics,
        }
    
    def check_docker_logs(self, container: str) -> Dict[str, Any]:
        """Check docker logs (last 10 lines)"""
        cmd = f"docker logs {container} --tail 10"
        
        output = self.run_command(cmd)
        return {
            "container": container,
            "docker_logs": output.strip().split('\n') if output else [],
        }
    
    def check_docker_stats(self, containers: List[str]) -> Dict[str, Any]:
        """Check docker stats for containers"""
        container_str = " ".join(containers)
        cmd = f"docker stats --no-stream {container_str} --format 'table {{{{.Container}}}}\t{{{{.CPUPerc}}}}\t{{{{.MemUsage}}}}'2>/dev/null || echo 'Stats unavailable'"
        
        output = self.run_command(cmd)
        return {
            "containers": containers,
            "stats_output": output.strip(),
        }
    
    def run_full_audit(self) -> Dict[str, Any]:
        """Run complete deep cycle audit"""
        print("=" * 70)
        print("DEEP CYCLE AUDIT - ENGINE STATUS REPORT")
        print("=" * 70)
        print(f"Timestamp: {datetime.utcnow().isoformat()}\n")
        
        audit = {
            "timestamp": datetime.utcnow().isoformat(),
            "engines": {},
            "system_stats": {},
        }
        
        # Check each engine
        for engine in self.engines:
            print(f"\n[{engine}]")
            print("-" * 70)
            
            engine_audit = {}
            
            # Logs
            print(f"Checking logs ({self.log_paths[engine]})...")
            logs = self.check_engine_logs(engine)
            engine_audit["logs"] = logs
            print(f"  Last lines: {len(logs['last_5_lines'])} entries")
            for line in logs["last_5_lines"][:2]:  # Show first 2
                print(f"    {line[:80]}")
            
            # Metrics
            print(f"Checking metrics ({self.metrics_paths[engine]})...")
            metrics = self.check_engine_metrics(engine)
            engine_audit["metrics"] = metrics
            print(f"  Metrics loaded: {len(str(metrics['metrics']))} bytes")
            
            # Docker logs
            print(f"Checking docker logs...")
            docker_logs = self.check_docker_logs(engine)
            engine_audit["docker_logs"] = docker_logs
            print(f"  Docker logs: {len(docker_logs['docker_logs'])} lines")
            
            audit["engines"][engine] = engine_audit
        
        # System stats
        print(f"\n[SYSTEM STATS]")
        print("-" * 70)
        print("Checking docker stats...")
        stats = self.check_docker_stats(self.engines)
        audit["system_stats"] = stats
        print(stats["stats_output"][:200])
        
        return audit
    
    def print_summary(self, audit: Dict[str, Any]):
        """Print audit summary"""
        print("\n" + "=" * 70)
        print("AUDIT SUMMARY")
        print("=" * 70)
        
        for engine in self.engines:
            if engine in audit["engines"]:
                engine_data = audit["engines"][engine]
                logs = engine_data.get("logs", {})
                metrics = engine_data.get("metrics", {})
                docker_logs = engine_data.get("docker_logs", {})
                
                print(f"\n{engine}:")
                print(f"  - Log entries: {len(logs.get('last_5_lines', []))}")
                print(f"  - Metrics: {'present' if metrics.get('metrics') else 'missing'}")
                print(f"  - Docker logs: {len(docker_logs.get('docker_logs', []))}")
        
        print("\n" + "=" * 70)
        print("STATUS: DEEP CYCLE AUDIT COMPLETE")
        print("=" * 70)


if __name__ == "__main__":
    audit = DeepCycleAudit()
    report = audit.run_full_audit()
    audit.print_summary(report)
    
    # Save report
    with open("/tmp/deep_cycle_audit.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print("\nAudit report saved to /tmp/deep_cycle_audit.json")
