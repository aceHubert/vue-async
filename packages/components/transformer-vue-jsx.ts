import * as ts from 'typescript';
import * as babel from '@babel/core';

export default function Plugin(_: ts.Program) {
  return (_ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      if (sourceFile.fileName.endsWith('.tsx')) {
        const result = babel.transform(sourceFile.text, {
          presets: ['@babel/preset-env'],
        });
        if (result) {
          console.log(result.code);
        }
      }
      return sourceFile;
    };
  };
}
