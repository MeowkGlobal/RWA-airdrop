import * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function UserAccountOutput(props: { title: string; output: number }) {
  return (
    <Card className="w-1/3 mt-20">
      <CardHeader className="flex justify-center text-center">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <h1>{props.output} </h1>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
