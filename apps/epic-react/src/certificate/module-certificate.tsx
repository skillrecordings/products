import React from 'react'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {LockClosedIcon} from '@heroicons/react/solid'
import Image from 'next/image'
import {trpc} from '@/trpc/trpc.client'
import cx from 'classnames'
import Balancer from 'react-wrap-balancer'
import * as Dialog from '@radix-ui/react-dialog'
import CertificateForm from './certificate-form'
import type {Workshop} from '@/lib/workshops'
import type {Tutorial} from '@/lib/tutorials'

const ModuleCertificate: React.FC<{module: Workshop | Tutorial}> = ({
  module,
}) => {
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })
  const isModuleCompleted = moduleProgress?.moduleCompleted

  return moduleProgressStatus === 'success' ? (
    <Dialog.Root>
      <div className="flex w-full flex-col items-start justify-center py-8">
        <h3 className="flex items-center gap-1 pb-2 text-lg font-semibold">
          Certificate
        </h3>
        <div className="relative flex w-full items-center justify-center">
          <div className="relative flex aspect-[1.414/1] h-full w-full flex-col items-center justify-center overflow-hidden rounded border">
            <Image
              alt=""
              aria-hidden="true"
              src="/assets/epic-react-certificate-bg.svg"
              fill
            />
            {module.image && (
              <Image
                src={module.image}
                alt=""
                aria-hidden="true"
                width={80}
                height={80}
                className="absolute top-5"
              />
            )}
          </div>
          {isModuleCompleted ? (
            <>
              <Dialog.Trigger
                className={cx(
                  'group absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded border border-border bg-background/0',
                )}
              >
                {isModuleCompleted && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-xs font-semibold uppercase leading-none text-black">
                    Available{' '}
                    <div className="h-1 w-1 animate-pulse rounded-full bg-rose-600" />
                  </div>
                )}
                <div className="mt-20 rounded bg-primary px-4 py-2 font-semibold text-primary-foreground shadow transition group-hover:scale-105 group-hover:brightness-110 dark:bg-primary dark:text-white">
                  Get Certificate
                </div>
              </Dialog.Trigger>
              <CertificateForm module={module} />
            </>
          ) : (
            <div
              className={cx(
                'absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center rounded border border-border bg-white/80 backdrop-blur-[2px] dark:bg-gray-900/80',
              )}
            >
              <div className="rounded-full border border-foreground/40 bg-foreground/5 p-2.5">
                <LockClosedIcon className="w-6 text-foreground" />
              </div>
              {!isModuleCompleted && (
                <div className="w-full px-5 pt-3 text-center leading-tight text-foreground">
                  <Balancer>
                    Complete all lessons to unlock this certificate.
                  </Balancer>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Dialog.Root>
  ) : null
}

export default ModuleCertificate
