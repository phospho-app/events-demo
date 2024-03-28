import { Button } from './ui/button'
import { Input } from './ui/input'

export function EmptyScreenText() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
      <h1 className="text-lg font-semibold">
        Discover phospho Event detection{' '}
      </h1>
      <p className="leading-normal text-muted-foreground">
        phospho is an open source text analytics platform that can detect{' '}
        <b>semantic events</b> in text.
      </p>
      <p className="leading-normal text-muted-foreground">
        Copy paste some text below to see how it works.
      </p>
    </div>
  )
}

export async function TextToEvents() {
  // if (!session?.user?.id) {
  //   return null
  // }

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 flex-column space-y-2">
        <EmptyScreenText />
        <Input placeholder={'Some text'} />
        <Button>Detect events</Button>
      </div>
    </>
  )
}
