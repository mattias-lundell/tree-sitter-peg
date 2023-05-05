all: generate install

generate:
	tree-sitter generate

install:
	gcc -shared -fPIC -g -O2 -Isrc src/parser.c -o ~/.emacs.d/tree-sitter/libtree-sitter-peg.so
