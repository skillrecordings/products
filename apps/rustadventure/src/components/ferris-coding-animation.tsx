import * as React from 'react'
import Ferris from 'components/ferris'
import ReactMarkdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {duotoneSpace as codeTheme} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import {motion, useReducedMotion} from 'framer-motion'

const FerrisCodingAnimation = () => {
  const shouldReduceMotion = useReducedMotion()

  const components: any = {
    code({node, inline, className, children, ...props}: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <motion.div
          animate={shouldReduceMotion ? {} : {y: ['0%', '-55.5%']}}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
        >
          <SyntaxHighlighter
            style={codeTheme}
            language={match[1]}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            codeTagProps={{
              className: `bg-transparent overflow-visible font-mono text-[0.6rem]`,
            }}
            customStyle={{
              backgroundColor: 'transparent',
              lineHeight: 1.1,
              padding: '0 0.75rem',
            }}
            {...props}
          />
        </motion.div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  }
  return (
    <div
      className="lg:max-w-[265px] md:max-w-[200px] max-w-[265px] sm:scale-100 scale-75"
      aria-hidden="true"
    >
      <div className="relative">
        <div className="bg-brand-gray shadow-inner h-64 w-full rounded-lg overflow-hidden flex flex-col justify-between">
          <ReactMarkdown components={components} children={code} />
          <div className="absolute bottom-0 w-full z-10 text-[0.6rem] font-mono space-x-2 font-semibold p-3 bg-white border border-brand-gray rounded-b-lg">
            <span className="text-blue-500">$</span>
            <span>rustc adventure.rs</span>
          </div>
        </div>
        <div className="w-40 absolute z-20 -bottom-12 -right-8">
          <Ferris />
        </div>
      </div>
    </div>
  )
}

const code = ` 
~~~rust
fn main() {
  println!("Hello World!");
}

use adventure_time::{config::get_manifest, init};
use clap::{crate_description, crate_version, App, AppSettings, Arg};
use tokio::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let matches = App::new("Adventure Time")
      .version(crate_version!())
      .author("Chris Biscardi <chris@christopherbiscardi.com>")
      .about(crate_description!())
      .setting(AppSettings::ColoredHelp)
      .subcommand(App::new("init"))
      .subcommand(
          App::new("watch")
              .about("Run all the tests for a course and watch for changes.")
              .arg(
                  Arg::new("debug")
                      .short('d')
                      .about("print debug information verbosely"),
              ),
      )
      .subcommand(
          App::new("list").about("list courses").arg(
              Arg::new("course")
                  .short('c')
                  .about("List the lessons in a course"),
          ),
      )
      .subcommand(
          App::new("init")
              .about("start working on a new course in a new directory")
              .arg(
                  Arg::new("course")
                      .short('c')
                      .about("The course id you want to start"),
              ),
      )
      .get_matches();

  match matches.subcommand_name() {
      Some("init") => init(matches.subcommand_matches("init").unwrap()),
      Some("list") => {}
      Some("watch") => {}
      _ => {}
  };
  Ok(())
}

fn main() {
  println!("Hello World!");
}

use adventure_time::{config::get_manifest, init};
use clap::{crate_description, crate_version, App, AppSettings, Arg};
use tokio::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let matches = App::new("Adventure Time")
      .version(crate_version!())
      .author("Chris Biscardi <chris@christopherbiscardi.com>")
      .about(crate_description!())
      .setting(AppSettings::ColoredHelp)
      .subcommand(App::new("init"))
      .subcommand(
          App::new("watch")
              .about("Run all the tests for a course and watch for changes.")
              .arg(
                  Arg::new("debug")
                      .short('d')
                      .about("print debug information verbosely"),
              ),
      )
      .subcommand(
          App::new("list").about("list courses").arg(
              Arg::new("course")
                  .short('c')
                  .about("List the lessons in a course"),
          ),
      )
      .subcommand(
          App::new("init")
              .about("start working on a new course in a new directory")
              .arg(
                  Arg::new("course")
                      .short('c')
                      .about("The course id you want to start"),
              ),

~~~

`

export default FerrisCodingAnimation
