'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const FormSchema = z.object({
  text: z
    .string()
    .min(3, {
      message: 'Please use some text'
    })
    .max(1000, {
      message: 'Text is too long. Please use less than 1000 characters.'
    })
})

export function TextareaForm() {}

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

export function TextToEvents() {
  // if (!session?.user?.id) {
  //   return null
  // }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // toast.info(JSON.stringify(data, null, 2))
  }

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 flex-column space-y-2">
        <EmptyScreenText />
        <div className="grid w-full gap-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Copy paste some text here."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {form.getValues('text') && (
                        <>{form.getValues('text')?.length ?? 0}/1000</>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Detect events
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
