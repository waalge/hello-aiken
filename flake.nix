{
  description = "Template for aiken projects";

  inputs = {
    devshell.url = "github:numtide/devshell";
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url="github:nixos/nixpkgs";
    aiken.url="github:aiken-lang/aiken?ref=flake";
  };

  outputs = { self, ...} @ inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system: 
        let pkgs = import inputs.nixpkgs {
          inherit system;
          overlays = [ 
            inputs.devshell.overlay 
            (self: super: { aiken = inputs.aiken.packages.${system}.aik ;})
            ];
        };
        in
     {
      devShell =
        pkgs.devshell.mkShell {
          name="hello-aiken";
          packages = with pkgs; [
            aiken
            deno
            rnix-lsp
          ];
        commands = [
            {
            name = "edit";
            category = "editor";
            help = "open nvim with aiken config";
            command = ''
              nvim -S ${self}/.nvim-aiken/ftdetect/aiken.vim \
                   -S ${self}/.nvim-aiken/indent/aiken.vim \
                   -S ${self}/.nvim-aiken/syntax/aiken.vim \
                  $1
            '';
          }
        ];
        };
    });
}
