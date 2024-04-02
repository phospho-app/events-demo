'use client'

import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue, useAIState } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'
import { Event } from '@/lib/models'
import { Badge } from '../ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { useEffect, useState } from 'react'
import { getEventsFromMessages } from '@/app/actions'
import { Message } from '@/lib/chat/actions'

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  )
}

export function BotMessage({
  content,
  className
}: {
  content: string | StreamableValue<string>
  className?: string
}) {
  const { rawContent: text, finished: streamingFinished } =
    useStreamableText(content)
  const [aiState] = useAIState()
  const [events, setEvents] = useState<Event[] | null>(null)

  useEffect(() => {
    ;(async () => {
      if (streamingFinished && events === null) {
        console.log('streamingFinished', streamingFinished)
        console.log('messages', aiState.messages)
        const foundEvents = await getEventsFromMessages(aiState.messages)
        setEvents(foundEvents)
      }
    })()
  }, [text])

  return (
    <div className={cn('group relative flex items-start md:-ml-12', className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {text}
        </MemoizedReactMarkdown>
        <div>
          {streamingFinished && events === null && <>{spinner}</>}
          {events && events.length === 0 && (
            <div className="text-xs pb-0.5">No event detected</div>
          )}
          {events && events.length > 0 && (
            <div className="text-xs pb-0.5">Detected events:</div>
          )}
          {events &&
            events.length > 0 &&
            events?.map(event => (
              <HoverCard key={event.id} openDelay={50} closeDelay={50}>
                <HoverCardTrigger>
                  <Badge key={event.id} className="text-sm">
                    {event.event_name}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div>
                    <h3 className="text-lg font-bold">{event.event_name}</h3>
                    <p className="text-muted-foreground">
                      {event.event_definition.description}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
        </div>
      </div>
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}
