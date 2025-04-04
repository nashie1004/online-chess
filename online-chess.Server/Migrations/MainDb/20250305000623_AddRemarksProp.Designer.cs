﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using online_chess.Server.Persistence;

#nullable disable

namespace online_chess.Server.Migrations.MainDb
{
    [DbContext(typeof(MainDbContext))]
    [Migration("20250305000623_AddRemarksProp")]
    partial class AddRemarksProp
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("online_chess.Server.Models.DTOs.LeaderboardList", b =>
                {
                    b.Property<int>("Draws")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("LastGameDate")
                        .HasColumnType("TEXT");

                    b.Property<int>("Loses")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Rank")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("SinceDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Wins")
                        .HasColumnType("INTEGER");

                    b.ToTable("LeaderboardList");
                });

            modelBuilder.Entity("online_chess.Server.Models.Entities.GameHistory", b =>
                {
                    b.Property<long>("GameHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("GameEndDate")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("GameStartDate")
                        .HasColumnType("TEXT");

                    b.Property<short>("GameType")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsDraw")
                        .HasColumnType("INTEGER");

                    b.Property<short>("PlayerOneColor")
                        .HasColumnType("INTEGER");

                    b.Property<long>("PlayerOneId")
                        .HasColumnType("INTEGER");

                    b.Property<short>("PlayerTwoColor")
                        .HasColumnType("INTEGER");

                    b.Property<long>("PlayerTwoId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Remarks")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long>("WinnerPlayerId")
                        .HasColumnType("INTEGER");

                    b.HasKey("GameHistoryId");

                    b.ToTable("GameHistories");
                });

            modelBuilder.Entity("online_chess.Server.Models.Profile.GameHistoryList", b =>
                {
                    b.Property<DateTime>("GameDate")
                        .HasColumnType("TEXT");

                    b.Property<short>("GameStatus")
                        .HasColumnType("INTEGER");

                    b.Property<short>("GameType")
                        .HasColumnType("INTEGER");

                    b.Property<int>("IndexNo")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsColorWhite")
                        .HasColumnType("INTEGER");

                    b.Property<string>("OpponentName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.ToTable("GameHistoryList");
                });

            modelBuilder.Entity("online_chess.Server.Models.Profile.GameTypeList", b =>
                {
                    b.Property<int>("Draws")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("LastGameDate")
                        .HasColumnType("TEXT");

                    b.Property<int>("Loses")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Rank")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Wins")
                        .HasColumnType("INTEGER");

                    b.ToTable("GameTypeList");
                });
#pragma warning restore 612, 618
        }
    }
}
