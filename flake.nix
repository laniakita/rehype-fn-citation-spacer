{
  description = "A dev flake.nix for laniakita/rehype-fn-citation-spacer";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    inputs@{ nixpkgs, ... }:
    let
      forAllSystems =
        function:
        nixpkgs.lib.genAttrs [
          "x86_64-linux"
          "aarch64-linux"
        ] (system: function nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (
        { pkgs, lib, ... }:
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              bun
              nodejs
              zsh
            ];

            NIX_LD_LIBRARY_PATH = lib.makeLibraryPath [
              pkgs.stdenv.cc.cc
              pkgs.openssl
              pkgs.zlib
              pkgs.fuse3
              pkgs.icu
              pkgs.nss
              pkgs.openssl
              pkgs.curl
              pkgs.expat
            ];

            NIX_LD = lib.fileContents "${pkgs.stdenv.cc}/nix-support/dynamic-linker";

            shellHook = ''
              export LD_LIBRARY_PATH=${
                pkgs.lib.makeLibraryPath [
                  pkgs.stdenv.cc.cc
                ]
              }
              exec zsh
            '';
          };
        }
      );
    };
}
