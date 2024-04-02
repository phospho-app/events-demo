'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { spinner } from '@/components/stocks/spinner'

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
import { getEventsFromText } from '@/app/actions'
import { useState } from 'react'
import { Badge } from './ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { Event } from '@/lib/models'

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

function EmptyScreenText() {
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
  const [events, setEvents] = useState<Event[] | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // toast.info(JSON.stringify(data, null, 2))
    // Make an API request to detect events
    const foundEvents = await getEventsFromText(data.text)
    console.log('foundEvents', foundEvents)
    setEvents(foundEvents)
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
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {!form.formState.isSubmitting && <>Detect events</>}
                {form.formState.isSubmitting && (
                  <>{spinner} Detecting events... </>
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex">
          {events && events.length > 0 && (
            <div className="flex-col space-y-2 pt-2">
              <h2 className="text-xl font-bold">Events detected:</h2>
              <div className="grid gap-2">
                {events.map(event => (
                  <HoverCard key={event.id} openDelay={50} closeDelay={50}>
                    <HoverCardTrigger>
                      <Badge key={event.id} className="text-sm">
                        {event.event_name}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div>
                        <h3 className="text-lg font-bold">
                          {event.event_name}
                        </h3>
                        <p className="text-muted-foreground">
                          {event.event_definition.description}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </div>
          )}
          {events && events.length === 0 && (
            <div className="flex items-center justify-center p-4 rounded-lg border bg-background">
              <p className="text-muted-foreground">No events found</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
