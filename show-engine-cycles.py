#!/usr/bin/env python3
"""
Quick engine analysis - show logs head/tail and cycle status
"""

import subprocess
import sys


def get_container_logs(container: str, lines: int = 20) -> tuple:
    """Get head and tail of container logs"""
    result = subprocess.run(
        f"docker logs {container}",
        shell=True,
        capture_output=True,
        text=True,
        timeout=10
    )
    
    if result.returncode != 0:
        return None, None
    
    all_lines = result.stdout.strip().split("\n")
    
    head = "\n".join(all_lines[:lines]) if len(all_lines) > lines else result.stdout
    tail = "\n".join(all_lines[-lines:]) if len(all_lines) > lines else result.stdout
    
    return head, tail


def main():
    engines = ["engine-all", "engine2-ops"]
    
    print("\n" + "=" * 90)
    print("🔧 ENGINE CYCLES - HEAD (First 20 lines) & TAIL (Last 20 lines)")
    print("=" * 90)
    
    for engine in engines:
        print(f"\n\n{'='*90}")
        print(f"📊 {engine.upper()}")
        print(f"{'='*90}")
        
        head, tail = get_container_logs(engine, lines=20)
        
        if head is None:
            print(f"✗ Error reading logs for {engine}")
            continue
        
        print(f"\n[HEAD - First 20 lines]")
        print("-" * 90)
        print(head)
        
        print(f"\n\n[TAIL - Last 20 lines]")
        print("-" * 90)
        print(tail)
        
        # Count cycles
        result = subprocess.run(
            f"docker logs {engine} 2>&1 | grep -c 'cycle complete'",
            shell=True,
            capture_output=True,
            text=True
        )
        
        cycle_count = result.stdout.strip() if result.stdout else "unknown"
        print(f"\n\n📈 Cycles Completed: {cycle_count}")


if __name__ == "__main__":
    main()
