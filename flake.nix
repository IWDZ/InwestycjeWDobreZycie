{
  description = "iwdz - Vite + React dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
          ];

          shellHook = ''
            echo "Node $(node --version) / npm $(npm --version)"
            echo ""
            echo "  npm install   – install dependencies"
            echo "  npm run dev   – start Vite dev server"
            echo "  npm run build – production build"
            echo "  npm run preview – preview production build"
          '';
        };
      }
    );
}
