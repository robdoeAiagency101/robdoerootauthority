#!/usr/bin/env python3
"""
Complete Docker/Git/Version Tagging System
Tags everything: images, containers, git, semantic versioning, build lanes
"""

import json
import subprocess
import os
from datetime import datetime
from typing import Dict, List, Tuple
import hashlib


class VersionManager:
    """Manage semantic versioning"""
    
    def __init__(self, current_version: str = "1.0.0"):
        """Initialize with semantic version X.Y.Z"""
        parts = current_version.split('.')
        self.major = int(parts[0])
        self.minor = int(parts[1])
        self.patch = int(parts[2])
    
    def next_major(self) -> str:
        self.major += 1
        self.minor = 0
        self.patch = 0
        return f"{self.major}.{self.minor}.{self.patch}"
    
    def next_minor(self) -> str:
        self.minor += 1
        self.patch = 0
        return f"{self.major}.{self.minor}.{self.patch}"
    
    def next_patch(self) -> str:
        self.patch += 1
        return f"{self.major}.{self.minor}.{self.patch}"
    
    def current(self) -> str:
        return f"{self.major}.{self.minor}.{self.patch}"


class DockerTagGenerator:
    """Generate comprehensive Docker tags"""
    
    def __init__(
        self,
        registry: str = "ghcr.io",
        org: str = "robdoeAiagency101",
        repo: str = "crypto-triangle"
    ):
        self.registry = registry
        self.org = org
        self.repo = repo
        self.base = f"{registry}/{org}/{repo}"
    
    def generate_all_tags(
        self,
        git_sha: str,
        git_branch: str,
        version: str,
        build_number: str,
        timestamp: str
    ) -> Dict[str, List[str]]:
        """Generate all possible Docker tags"""
        
        tags = {
            "semantic": [
                f"{self.base}:{version}",
                f"{self.base}:v{version}",
                f"{self.base}:latest",
                f"{self.base}:stable"
            ],
            "git": [
                f"{self.base}:{git_branch}",
                f"{self.base}:{git_sha[:7]}",
                f"{self.base}:{git_branch}-{git_sha[:7]}",
                f"{self.base}:git-{git_sha}"
            ],
            "build": [
                f"{self.base}:build-{build_number}",
                f"{self.base}:build-{build_number}-{git_sha[:7]}",
                f"{self.base}:#{build_number}"
            ],
            "timestamp": [
                f"{self.base}:ts-{timestamp.replace(':', '-')}",
                f"{self.base}:{datetime.fromisoformat(timestamp).strftime('%Y%m%d')}",
                f"{self.base}:{datetime.fromisoformat(timestamp).strftime('%Y%m%d-%H%M%S')}"
            ],
            "combined": [
                f"{self.base}:v{version}-build-{build_number}",
                f"{self.base}:v{version}-{git_branch}",
                f"{self.base}:v{version}-{git_sha[:7]}",
                f"{self.base}:{version}-{build_number}-{git_branch}"
            ],
            "lanes": {
                "dev": f"{self.base}:dev-{build_number}",
                "staging": f"{self.base}:staging-{version}",
                "production": f"{self.base}:prod-{version}",
                "hotfix": f"{self.base}:hotfix-{git_branch}",
                "experimental": f"{self.base}:exp-{git_sha[:7]}"
            }
        }
        
        return tags
    
    def flatten_tags(self, tags_dict: Dict) -> List[str]:
        """Flatten all tags into single list"""
        flat = []
        for key, value in tags_dict.items():
            if isinstance(value, list):
                flat.extend(value)
            elif isinstance(value, dict):
                flat.extend(value.values())
        return list(set(flat))  # Remove duplicates


class GitTagManager:
    """Manage Git tagging and versioning"""
    
    def __init__(self, repo_path: str = "."):
        self.repo_path = repo_path
    
    def run_git(self, cmd: str) -> Tuple[str, bool]:
        """Run git command"""
        try:
            result = subprocess.run(
                f"git -C {self.repo_path} {cmd}",
                shell=True,
                capture_output=True,
                text=True
            )
            return result.stdout.strip(), result.returncode == 0
        except Exception as e:
            return str(e), False
    
    def get_current_sha(self) -> str:
        """Get current commit SHA"""
        sha, _ = self.run_git("rev-parse --short HEAD")
        return sha
    
    def get_current_branch(self) -> str:
        """Get current branch"""
        branch, _ = self.run_git("rev-parse --abbrev-ref HEAD")
        return branch
    
    def create_version_tag(
        self,
        version: str,
        message: str = None
    ) -> Tuple[str, bool]:
        """Create annotated git tag"""
        msg = message or f"Release version {version}"
        tag_name = f"v{version}"
        output, success = self.run_git(f"tag -a {tag_name} -m '{msg}'")
        return tag_name if success else output, success
    
    def create_build_tag(
        self,
        build_number: str,
        branch: str
    ) -> Tuple[str, bool]:
        """Create build number tag"""
        tag_name = f"build/{branch}/{build_number}"
        output, success = self.run_git(f"tag -a {tag_name} -m 'Build {build_number}'")
        return tag_name if success else output, success
    
    def create_lane_tag(
        self,
        lane: str,
        version: str
    ) -> Tuple[str, bool]:
        """Create lane-specific tag"""
        tag_name = f"lane/{lane}/{version}"
        output, success = self.run_git(f"tag -a {tag_name} -m 'Lane {lane} - {version}'")
        return tag_name if success else output, success
    
    def list_tags(self) -> List[str]:
        """List all tags"""
        tags, _ = self.run_git("tag")
        return tags.split('\n') if tags else []
    
    def push_tags(self, remote: str = "origin") -> Tuple[str, bool]:
        """Push all tags"""
        output, success = self.run_git(f"push {remote} --tags")
        return output, success


class ContainerManager:
    """Manage container naming and composition"""
    
    def __init__(self, compose_file: str = "docker-compose.yml"):
        self.compose_file = compose_file
    
    def generate_container_names(
        self,
        service: str,
        version: str,
        build_number: str,
        lane: str
    ) -> Dict[str, str]:
        """Generate container names for all lanes"""
        
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        
        names = {
            "dev": f"{service}-dev-{build_number}",
            "staging": f"{service}-staging-v{version}",
            "production": f"{service}-prod-v{version}",
            "hotfix": f"{service}-hotfix-{build_number}",
            "experimental": f"{service}-exp-{timestamp}",
            "default": f"{service}-{lane}-{version}-{build_number}"
        }
        
        return names
    
    def generate_volume_names(
        self,
        service: str,
        lane: str
    ) -> Dict[str, str]:
        """Generate volume names per lane"""
        
        volumes = {
            "dev": f"{service}-dev-data",
            "staging": f"{service}-staging-data",
            "production": f"{service}-prod-data",
            "hotfix": f"{service}-hotfix-data",
            "experimental": f"{service}-exp-data"
        }
        
        return volumes
    
    def generate_network_names(
        self,
        lane: str
    ) -> Dict[str, str]:
        """Generate network names per lane"""
        
        networks = {
            "dev": "crypto-dev-net",
            "staging": "crypto-staging-net",
            "production": "crypto-prod-net",
            "hotfix": "crypto-hotfix-net",
            "experimental": "crypto-exp-net"
        }
        
        return networks


class ComprehensiveTaggingSystem:
    """Complete tagging system combining Docker, Git, and lanes"""
    
    def __init__(
        self,
        version: str = "1.0.0",
        registry: str = "ghcr.io",
        org: str = "robdoeAiagency101"
    ):
        self.version_mgr = VersionManager(version)
        self.docker_mgr = DockerTagGenerator(registry, org)
        self.git_mgr = GitTagManager()
        self.container_mgr = ContainerManager()
        self.timestamp = datetime.utcnow().isoformat() + "Z"
    
    def generate_complete_tags(
        self,
        service: str,
        build_number: str,
        lane: str = "dev"
    ) -> Dict:
        """Generate all tags for build"""
        
        git_sha = self.git_mgr.get_current_sha()
        git_branch = self.git_mgr.get_current_branch()
        version = self.version_mgr.current()
        
        return {
            "timestamp": self.timestamp,
            "version": version,
            "git": {
                "sha": git_sha,
                "branch": git_branch
            },
            "build": {
                "number": build_number,
                "lane": lane
            },
            "docker": {
                "tags": self.docker_mgr.generate_all_tags(
                    git_sha, git_branch, version, build_number, self.timestamp
                ),
                "flatten": self.docker_mgr.flatten_tags(
                    self.docker_mgr.generate_all_tags(
                        git_sha, git_branch, version, build_number, self.timestamp
                    )
                )
            },
            "containers": self.container_mgr.generate_container_names(
                service, version, build_number, lane
            ),
            "volumes": self.container_mgr.generate_volume_names(service, lane),
            "networks": self.container_mgr.generate_network_names(lane),
            "git_tags": {
                "version": f"v{version}",
                "build": f"build/{git_branch}/{build_number}",
                "lane": f"lane/{lane}/{version}"
            }
        }
    
    def create_tag_matrix(
        self,
        service: str,
        build_number: str
    ) -> Dict:
        """Create tag matrix for all lanes"""
        
        lanes = ["dev", "staging", "production", "hotfix", "experimental"]
        
        matrix = {}
        for lane in lanes:
            matrix[lane] = self.generate_complete_tags(
                service, build_number, lane
            )
        
        return matrix
    
    def export_tags_json(self, tags: Dict, output_file: str):
        """Export all tags to JSON file"""
        with open(output_file, 'w') as f:
            json.dump(tags, f, indent=2)
    
    def export_docker_tags_file(self, tags: Dict, output_file: str):
        """Export tags in Docker buildx format"""
        docker_tags = tags["docker"]["flatten"]
        with open(output_file, 'w') as f:
            f.write(',\n'.join(docker_tags))
    
    def export_shell_script(self, tags: Dict, output_file: str):
        """Export as shell script for Docker commands"""
        
        script = "#!/bin/bash\n"
        script += "# Complete tagging script\n\n"
        
        script += "# Docker tags\n"
        for tag in tags["docker"]["flatten"]:
            script += f"docker tag source-image {tag}\n"
        
        script += "\n# Git tags\n"
        for tag_type, tag_name in tags["git_tags"].items():
            script += f"git tag -a {tag_name} -m 'Auto-tagged: {tag_type}'\n"
        
        script += "\n# Container names (for reference)\n"
        for lane, name in tags["containers"].items():
            script += f"# {lane}: {name}\n"
        
        with open(output_file, 'w') as f:
            f.write(script)
        
        os.chmod(output_file, 0o755)


def main():
    """Example usage"""
    import sys
    
    print("\n" + "=" * 70)
    print("🏷️  COMPREHENSIVE TAGGING SYSTEM")
    print("=" * 70)
    
    # Initialize system
    system = ComprehensiveTaggingSystem(
        version="2.0.0",
        registry="ghcr.io",
        org="robdoeAiagency101"
    )
    
    # Generate tags for all lanes
    print("\n[1/4] Generating tags for all lanes...")
    tag_matrix = system.create_tag_matrix(
        service="crypto-triangle",
        build_number="12345"
    )
    
    print("✓ Generated tags for all lanes")
    
    # Export to files
    print("\n[2/4] Exporting tags...")
    system.export_tags_json(
        tag_matrix,
        "/tmp/all-tags.json"
    )
    print("✓ Exported: all-tags.json")
    
    system.export_docker_tags_file(
        tag_matrix["dev"],
        "/tmp/docker-tags.txt"
    )
    print("✓ Exported: docker-tags.txt")
    
    system.export_shell_script(
        tag_matrix["dev"],
        "/tmp/tag-all.sh"
    )
    print("✓ Exported: tag-all.sh")
    
    # Display complete tag structure
    print("\n[3/4] Complete tag structure:")
    print(json.dumps(tag_matrix["dev"], indent=2))
    
    # Display all lanes summary
    print("\n[4/4] Summary by lane:")
    for lane, tags in tag_matrix.items():
        docker_count = len(tags["docker"]["flatten"])
        print(f"\n{lane.upper()}:")
        print(f"  Docker tags: {docker_count}")
        print(f"  Container: {tags['containers'][lane]}")
        print(f"  Volume: {tags['volumes'][lane]}")
        print(f"  Network: {tags['networks'][lane]}")
        print(f"  Git tag: {tags['git_tags']['lane']}")
    
    print("\n" + "=" * 70)
    print("✅ ALL TAGS GENERATED AND EXPORTED")
    print("=" * 70)


if __name__ == "__main__":
    main()
